import * as z from "zod";
import {v4 as uuidv4, validate} from "uuid";

const productSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    desrciption: z.string(),
    price: z.number().gte(0),
    category: z.string(),
    inStock: z.boolean()
});

const createProductSchema = productSchema.omit({id: true});

type Product = z.infer<typeof productSchema>;

const productArray: Product[] = [];

// productArray.push({id: "96a862a1-2470-4079-bb3a-3a062fbac6ad", name: "bananas", desrciption: "really tasty", price: 3.4, category: "fruit", inStock: false});
// productArray.push({id: "9388f4de-324e-48d5-becf-570a69b687df", name: "oranges", desrciption: "really tasty", price: 4.5, category: "fruit", inStock: true});

export async function getProducts(request, response){
    response.code(200).send(productArray);
}

export async function getProductsById(request, response) {
    const productId = request.params.productId;

    if (!(validate(productId))){
        response.code(400).send("uuid not valid");
    }

    for (let prod of productArray){
        if (prod.id == productId){
            response.code(200).send(prod);
        }
    }
    response.code(404);
}

export async function createProduct(request, response){
    const body = request.body;
    
    try{
        body["id"] = uuidv4();

        if (body.price < 0){
            response.code(400).send("Price Can't be negative");
        }

        createProductSchema.parse(body);

    } catch {
        response.code(400).send("format not valid");
    }

    productArray.push(body);

    response.code(201).send(productArray);
}

export async function updateProduct(request, response) {
    const updates = request.body;

    const productId = request.params.productId;

    let changingProductIndex = -1;

    if (!(validate(productId))){
        response.code(400).send("uuid not valid");
    }

    for (let i = 0; i < productArray.length; i++){
        if (productArray[i].id == productId){
            changingProductIndex = i;
        }
        else{
            console.log(productArray[i].id);
        }
    }

    if (changingProductIndex == -1){
        response.code(404).send("id doesn't exist")
    }

    for (let changes in updates){
        if (changes in productArray[changingProductIndex] && typeof(changes) == "string"){
            productArray[changingProductIndex][changes] = updates[changes];
        }
    }
    response.code(200).send(productArray);
}

export async function deleteProduct(request, response) {
    const productId = request.params.productId;

    if (!(validate(productId))){
        response.code(400).send("uuid not valid");
    }

    for (let i = 0; i < productArray.length; i++){
        if (productArray[i].id == productId){
            productArray.splice(i, 1);
            response.code(204);
        }
    }
    response.code(404);
}

