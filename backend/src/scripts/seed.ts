import { closePlatformDatabase, connectPlatformDatabase } from "../db/platform.js";
import { closeTenantDatabases, getTenantConnection } from "../db/tenant.js";
import { getProductModel } from "../models/product.js";
import { Website } from "../models/platform.js";

const products = [
  {name:"Rocket Time",sku:"AT-K101",slug:"rocket-time",category:"Ages 3–6",description:"A cheerful first watch with big, easy-to-read numbers and a soft strap for little wrists.",price:499,moq:1,increment:1,dialColour:"Sky blue",strapMaterial:"Soft silicone",variants:["Rocket Blue","Sunny Yellow"],stockStatus:"In Stock",featured:true,newArrival:true,status:"published",archived:false,images:[]},
  {name:"Rainbow Pop",sku:"AT-K204",slug:"rainbow-pop",category:"Ages 7–10",description:"A bright everyday watch that adds a playful pop of colour to school days and weekends.",price:549,moq:1,increment:1,dialColour:"Rainbow white",strapMaterial:"Soft silicone",variants:["Coral Pink","Mint Green","Purple"],stockStatus:"In Stock",featured:true,newArrival:false,status:"published",archived:false,images:[]},
  {name:"Dino Explorer",sku:"AT-K310",slug:"dino-explorer",category:"Ages 3–6",description:"A fun dinosaur-themed watch with clear numbers and a comfortable, kid-friendly strap.",price:525,moq:1,increment:1,dialColour:"Mint green",strapMaterial:"Soft silicone",variants:["Dino Green","Ocean Blue"],stockStatus:"In Stock",featured:true,newArrival:true,status:"published",archived:false,images:[]},
  {name:"Galaxy Dash",sku:"AT-K118",slug:"galaxy-dash",category:"Ages 11–14",description:"A sporty space-inspired watch for older kids who like bold colours and energetic style.",price:699,moq:1,increment:1,dialColour:"Midnight blue",strapMaterial:"Durable silicone",variants:["Galaxy Blue","Cosmic Black"],stockStatus:"Out of Stock",featured:false,newArrival:true,status:"published",archived:false,images:[]},
  {name:"Happy Hearts",sku:"AT-K221",slug:"happy-hearts",category:"Ages 7–10",description:"A sweet heart-themed watch designed for birthdays, parties and everyday smiles.",price:575,moq:1,increment:1,dialColour:"Blush pink",strapMaterial:"Soft silicone",variants:["Blush Pink","Lilac"],stockStatus:"In Stock",featured:false,newArrival:true,status:"published",archived:false,images:[]},
  {name:"Game On",sku:"AT-K126",slug:"game-on",category:"Ages 11–14",description:"A cool, easy-to-wear watch with a clean dial and a comfortable strap for active days.",price:649,moq:1,increment:1,dialColour:"Electric blue",strapMaterial:"Durable silicone",variants:["Electric Blue","Lime Green"],stockStatus:"In Stock",featured:false,newArrival:false,status:"published",archived:false,images:[]},
] as const;

await connectPlatformDatabase();
try {
  const website = await Website.findOne({ slug: "arbuda-times", active: true });
  if (!website) throw new Error("Run npm run bootstrap first");
  const Product = getProductModel(await getTenantConnection(String(website.databaseName)));
  for (const product of products) await Product.updateOne({ sku: product.sku }, { $setOnInsert: product }, { upsert: true });
  console.log(`Seeded ${products.length} Arbuda Times products`);
} finally {
  await closeTenantDatabases();
  await closePlatformDatabase();
}
