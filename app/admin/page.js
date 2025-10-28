"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLogin from "./login";
import { productAPI } from "@/lib/api";

export default function AdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        stock: "",
        featured: false,
        description: "",
        images: [],
        shades: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newShadeName, setNewShadeName] = useState("");
    const [newShadeCode, setNewShadeCode] = useState("#000000");
    const [categories, setCategories] = useState(["nails", "hudamoji", "mix brands"]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        if (loggedIn) fetchProducts();
    }, [loggedIn]);

    async function fetchProducts() {
        setLoading(true);
        setError("");
        try {
            const res = await productAPI.getAll();
            if (res.success) setProducts(res.data);
            else setError(res.error || "Failed to fetch products");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function handleInput(e) {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const fileList = Array.from(files).slice(0, 6); // Limit to 6 images
            setForm(f => ({ ...f, images: fileList }));
            
            // Create image previews
            const previews = fileList.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        } else if (type === "checkbox") {
            setForm(f => ({ ...f, [name]: e.target.checked }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    }

    function removeImage(index) {
        const newImages = form.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setForm(f => ({ ...f, images: newImages }));
        setImagePreviews(newPreviews);
    }

    function addShade() {
        if (!newShadeName.trim()) {
            alert("Please enter a shade name");
            return;
        }
        const newShade = { name: newShadeName.trim(), code: newShadeCode };
        setForm(f => ({ ...f, shades: [...f.shades, newShade] }));
        setNewShadeName("");
        setNewShadeCode("#000000");
    }

    function removeShade(index) {
        setForm(f => ({ ...f, shades: f.shades.filter((_, i) => i !== index) }));
    }

    async function handleAddProduct(e) {
        e.preventDefault();
        
        // Validate images
        if (!form.images || form.images.length === 0) {
            setError("Please select at least one product image");
            return;
        }
        
        if (form.images.length > 6) {
            setError("Maximum 6 images allowed");
            return;
        }
        
        setLoading(true);
        setError("");
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === "images") {
                    if (v && v.length > 0) {
                        v.forEach(file => fd.append("images", file));
                    }
                } else if (k === "shades") {
                    fd.append("shades", JSON.stringify(v));
                } else {
                    fd.append(k, v);
                }
            });
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products`, {
                method: "POST",
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                setShowForm(false);
                setForm({ name: "", price: "", originalPrice: "", category: "", stock: "", featured: false, description: "", images: [], shades: [] });
                setImagePreviews([]);
                fetchProducts();
                alert("Product added!");
            } else {
                setError(data.error || "Failed to add product");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteProduct(id) {
        if (!window.confirm("Delete this product?")) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                fetchProducts();
                alert("Product deleted!");
            } else {
                setError(data.error || "Failed to delete product");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function handleEditProduct(product) {
        setEditingProduct(product);
        setForm({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || "",
            category: product.category,
            stock: product.stock,
            featured: product.featured,
            description: product.description,
            images: [],
            shades: product.shades || []
        });
        // Set existing image previews
        setImagePreviews(product.images.map(img => img.url));
        setShowForm(true);
    }

    async function handleUpdateProduct(e) {
        e.preventDefault();
        
        if (!editingProduct) return;
        
        setLoading(true);
        setError("");
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === "images") {
                    if (v && v.length > 0) {
                        v.forEach(file => fd.append("images", file));
                        fd.append("replaceImages", "true");
                    }
                } else if (k === "shades") {
                    fd.append("shades", JSON.stringify(v));
                } else {
                    fd.append(k, v);
                }
            });
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products/${editingProduct._id}`, {
                method: "PUT",
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                setShowForm(false);
                setEditingProduct(null);
                setForm({ name: "", price: "", originalPrice: "", category: "", stock: "", featured: false, description: "", images: [], shades: [] });
                setImagePreviews([]);
                fetchProducts();
                alert("Product updated!");
            } else {
                setError(data.error || "Failed to update product");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelEdit() {
        setEditingProduct(null);
        setShowForm(false);
        setForm({ name: "", price: "", originalPrice: "", category: "", stock: "", featured: false, description: "", images: [], shades: [] });
        setImagePreviews([]);
        setError("");
    }

    if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-black">Admin Panel - Products</h1>
                    <a 
                        href="/admin/orders"
                        className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
                    >
                        View Orders
                    </a>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => {
                    if (showForm && editingProduct) {
                        handleCancelEdit();
                    } else {
                        setShowForm(f => !f);
                    }
                }}>
                    {showForm ? "Close" : "Add New Product"}
                </button>
                {showForm && (
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="mb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" value={form.name} onChange={handleInput} required placeholder="Product Name" className="px-3 py-2 border rounded w-full text-black placeholder-black" />
                            <input name="price" value={form.price} onChange={handleInput} required placeholder="Price" type="number" className="px-3 py-2 border rounded w-full text-black placeholder-black" />
                            <input name="originalPrice" value={form.originalPrice} onChange={handleInput} placeholder="Original Price" type="number" className="px-3 py-2 border rounded w-full text-black placeholder-black" />
                            <select name="category" value={form.category} onChange={handleInput} required className="px-3 py-2 border rounded w-full text-black">
                                <option value="" className="text-black">Select Category</option>
                                {categories.map(c => <option key={c} value={c} className="text-black">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                            <input name="stock" value={form.stock} onChange={handleInput} required placeholder="Stock" type="number" className="px-3 py-2 border rounded w-full text-black placeholder-black" />
                            <label className="flex items-center space-x-2">
                                <input name="featured" type="checkbox" checked={form.featured} onChange={handleInput} />
                                <span className="text-black">Featured</span>
                            </label>
                        </div>
                        <textarea name="description" value={form.description} onChange={handleInput} required placeholder="Description" className="px-3 py-2 border rounded w-full text-black placeholder-black" />
                        
                        {/* Image Upload Section */}
                        <div className="space-y-3">
                            <label className="block text-black font-medium">Product Images (Max 6)</label>
                            <input 
                                name="images" 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={handleInput} 
                                className="w-full text-black"
                                max="6"
                            />
                            <p className="text-sm text-gray-600">Upload 1-6 images. First image will be the main product image. {editingProduct && "Leave empty to keep existing images."}</p>
                            
                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <Image 
                                                src={preview} 
                                                alt={`Preview ${index + 1}`} 
                                                width={200}
                                                height={96}
                                                className="w-full h-24 object-cover rounded border"
                                                unoptimized
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                    Main
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Shade Management Section */}
                        <div className="space-y-3 border-t pt-4">
                            <label className="block text-black font-medium">Product Shades (Optional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newShadeName}
                                    onChange={(e) => setNewShadeName(e.target.value)}
                                    placeholder="Shade Name (e.g., Ruby Red)"
                                    className="flex-1 px-3 py-2 border rounded text-black placeholder-gray-400"
                                />
                                <input
                                    type="color"
                                    value={newShadeCode}
                                    onChange={(e) => setNewShadeCode(e.target.value)}
                                    className="w-16 h-10 border rounded cursor-pointer"
                                    title="Pick shade color"
                                />
                                <button
                                    type="button"
                                    onClick={addShade}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    Add Shade
                                </button>
                            </div>
                            
                            {/* Display Added Shades */}
                            {form.shades.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                    {form.shades.map((shade, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded bg-white">
                                            <div
                                                className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                                                style={{ backgroundColor: shade.code }}
                                            ></div>
                                            <span className="text-sm text-black flex-1 truncate">{shade.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeShade(index)}
                                                className="text-red-500 hover:text-red-700 text-lg"
                                                title="Remove shade"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-sm text-gray-600">Add color variations/shades for this product (e.g., different nail polish colors)</p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                {editingProduct ? "Update Product" : "Add Product"}
                            </button>
                            {editingProduct && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Cancel
                                </button>
                            )}
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </form>
                )}
                <h2 className="text-xl text-black font-semibold mb-2">Products</h2>
                {loading ? <div className="text-black">Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                    <div>
                        {products.length === 0 ? <div className="text-black">No products found.</div> : products.map(product => (
                            <div key={product._id} className="border rounded p-4 mb-4 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-black">{product.name}</div>
                                    <div className="text-sm text-black">{product.category.charAt(0).toUpperCase() + product.category.slice(1)} | Stock: {product.stock}</div>
                                    <div className="text-green-600 font-bold">Rs{product.price}</div>
                                    <div className="text-xs text-black">{product.description?.slice(0, 60)}...</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleEditProduct(product)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                                    {/* Show all product images */}
                                    <div className="flex space-x-1">
                                        {product.images && product.images.length > 0 ? (
                                            product.images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <Image 
                                                        src={image.url} 
                                                        alt={`${product.name} ${index + 1}`} 
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 object-cover rounded border"
                                                    />
                                                    {index === 0 && (
                                                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                            M
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}