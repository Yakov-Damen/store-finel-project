import { useState, useEffect, useContext } from "react";
import {
    Grid,
    Typography,
    Button,
    IconButton,
    Box,
    Paper,
    CircularProgress,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { useNavigate, useParams } from "react-router-dom";
import productsAPI from "../api/productsAPI";
import { Product } from "../types/Product.ts";
import StoreMap from "../components/StoreMap.tsx";
import cartsAPI from "../api/cartsAPI.ts";
import * as localstorage from "../utils/cartLocalStorageUtils.ts";
import CartItem from "../types/CartItem.ts";
import { toastError, toastSuccess } from "../utils/toastUtils.ts";
import { UserContext } from "../UserContext.tsx";
import Rating from "../components/Rating.tsx";
// import DialogReview from "../mui/DialogReview.tsx";
import ProductReviews from "../components/ProductReviews .tsx";
import DialogReview from "../mui/DialogReview.tsx";
const reviews = [
    {
        title: "Great Product",
        author: "John Doe",
        body: "Lorem ipsum...",
        rating: 5,
        thumbUp: 10,
        thumbDown: 2,
    },
    // Add more reviews as needed
];
const ProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState<null | Product | any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const context = useContext(UserContext)!;
    const { userInfo, setProductsInCart } = context;
    const { pid } = useParams();

    //handle get product by id from server
    const getProductAndReview = async (pid: string) => {
        try {
            const data = await productsAPI.getReviewsAndProduct(pid!);
            console.log("hi from productpage, data:", data);
            const product = {
                id: "a86eaf9c-9ebe-4393-a52f-82c159cc1afe",
                name: "Product 1",
                salePrice: 29.99,
                quantity: 10,
                description: "Description for Product 1.",
                category: "Category A",
                discountPercentage: 10,
                rating: 4.5,
                click: 100,
                coordinate: {
                    longitude1: 40.7128,
                    longitude2: -74.006,
                    longitude3: 45.5122,
                    latitude1: -74.006,
                    latitude2: 40.7128,
                    latitude3: -122.6795,
                },
                image: {
                    url: "https://example.com/product1.jpg",
                    alt: "Product 1 Image",
                },
                tags: {
                    tag1: "Tag A",
                    tag2: "Tag B",
                },
            };
            // console.log("hi from productpage, product:", product);
            setProduct(product);
            // console.log("hi from productPage, product:", product);
        } catch (error) {
            console.error("Failed to fetch");
        }
    };

    //get the product after the page is rendered
    useEffect(() => {
        getProductAndReview("1");
    }, []);

    //handle decrease quantity by clicking on the minus button (when quantity shouldnt be lower then 1)
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQty) => prevQty - 1);
        }
    };
    //handle add to cart. (if user logged in, products is being added to db at the server, else its stored in localstorage)
    const handleAddToCart = async () => {
        if (quantity > product!.quantity) {
            toastError(`Only ${product!.quantity} in stock`);
            return;
        }
        if (userInfo) {
            const userid = userInfo.id;
            console.log("hi from productpage", product);
            try {
                const cart = await cartsAPI.addToCart(
                    userid,
                    product!.id,
                    quantity.toString()
                );
                    console.log("hi from productpage, cart:", cart);
                toastSuccess("Added to cart!");
                setQuantity(1);
                // setProductsInCart(cart.items.length);
            } catch (error) {
                console.error("failed to add to cart, from ProductPage");
                toastError("Failed to add");
            }
        } else {
            const itemForCart: CartItem = {
                product_id: product!,
                quantity: quantity,
            };
            localstorage.addToCart(itemForCart);
            setProductsInCart(localstorage.getCart().length);
            toastSuccess("Added to cart!");
            setQuantity(1);
        }
    };
    //Navigate the user to choose another product to compare them
    const handleCompareProducts = () => {
        navigate(`/category/${product!.category}`, { state: product });
    };
    //If the the product isn't loaded yet, show "Loading product..."
    if (!product) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    //When the product is loaded then show the component
    return (
        <>
            <Paper style={{ margin: 50 }}>
                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid
                        item
                        xs={6}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <img
                            src={product?.image.url}
                            alt={product?.name}
                            height={200}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h3">{product?.name}</Typography>
                        <Typography variant="body1">
                            {product?.description}
                        </Typography>
                        <Typography variant="h6">
                            ${product?.salePrice}
                        </Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <IconButton onClick={decrementQuantity}>
                                <RemoveCircleRoundedIcon></RemoveCircleRoundedIcon>
                            </IconButton>
                            <Box>{quantity}</Box>
                            <IconButton
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <AddCircleRoundedIcon></AddCircleRoundedIcon>
                            </IconButton>
                        </div>
                        <div
                            style={{
                                margin: "5px",
                                alignItems: "space-around",
                            }}
                        >
                            <Button
                                style={{ margin: 5 }}
                                variant="contained"
                                color="primary"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                style={{ margin: 5 }}
                                variant="contained"
                                color="primary"
                                onClick={handleCompareProducts}
                            >
                                Compare similar products
                            </Button>
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 10,
                                    alignItems: "center",
                                }}
                            >
                                <DialogReview pid={pid} />
                                <div style={{ margin: "20px" }}>
                                    <Rating />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Paper
                style={{
                    margin: "10px 50px",
                    height: "auto",
                    maxHeight: 500,
                    overflowY: "auto",
                    padding: "20px",
                }}
            >
                <ProductReviews reviews={reviews} />
                <br />
            </Paper>
            ​
            <br />
            <Paper
                style={{
                    margin: "10px 50px",
                    height: "auto",
                    position: "relative",
                    padding: "20px",
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Store Location
                </Typography>
                <div style={{ height: "400px" }}>
                    <StoreMap />
                </div>
            </Paper>
        </>
    );
};
export default ProductPage;
