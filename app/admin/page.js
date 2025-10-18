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
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState(["nails", "brushes", "hudamoji", "mix brands"]);

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
            const fileList = Array.from(files).slice(0, 3); // Limit to 3 images
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

    async function handleAddProduct(e) {
        e.preventDefault();
        
        // Validate images
        if (!form.images || form.images.length === 0) {
            setError("Please select at least one product image");
            return;
        }
        
        if (form.images.length > 3) {
            setError("Maximum 3 images allowed");
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
                setForm({ name: "", price: "", originalPrice: "", category: "", stock: "", featured: false, description: "", images: [] });
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

    if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold text-black mb-4">Admin Panel</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShowForm(f => !f)}>
                    {showForm ? "Close" : "Add New Product"}
                </button>
                {showForm && (
                    <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
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
                            <label className="block text-black font-medium">Product Images (Max 3)</label>
                            <input 
                                name="images" 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={handleInput} 
                                className="w-full text-black"
                                max="3"
                            />
                            <p className="text-sm text-gray-600">Upload 1-3 images. First image will be the main product image.</p>
                            
                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-3">
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
                        
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
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
                                    <div className="text-green-600 font-bold">${product.price}</div>
                                    <div className="text-xs text-black">{product.description?.slice(0, 60)}...</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
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