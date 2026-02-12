"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  databases,
  storage,
  account,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID, Query, Permission, Role } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;

interface DbProduct {
  $id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  materials: string;
  images: string[];
  in_stock: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  colors: string[];
  sizes: string[];
}

interface DbOrder {
  $id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: Array<{ product_id: string; quantity: number; price: number }>;
  total: number;
  status: string;
  $createdAt: string;
}

interface ProductForm {
  name: string;
  price: number;
  category: string;
  description: string;
  materials: string;
  in_stock: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  colors: string;
  sizes: string;
  images: File[] | string[];
}

const emptyProduct: ProductForm = {
  name: "",
  price: 0,
  category: "bags",
  description: "",
  materials: "",
  in_stock: true,
  is_best_seller: false,
  is_new_arrival: false,
  colors: "",
  sizes: "",
  images: [] as File[],
};

export default function Admin() {
  const router = useRouter();

  const [products, setProducts] = useState<DbProduct[]>([]);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  /* ===========================
     FETCH PRODUCTS
  ============================ */
  const fetchProducts = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")],
      );
      setProducts(res.documents as unknown as DbProduct[]);
    } catch {
      toast.error("Failed to load products");
    }
  };

  /* ===========================
     FETCH ORDERS
  ============================ */
  const fetchOrders = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")],
      );
      setOrders(res.documents as unknown as DbOrder[]);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Get current user
        const user = await account.get();

        // Fetch user document from the database
        const res = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", user.$id)],
        );

        const userDoc = res.documents[0];

        if (!userDoc || userDoc.role !== "admin") {
          router.push("/"); // Not admin
          return;
        }

        // Only fetch products/orders if admin
        await fetchProducts();
        await fetchOrders();
      } catch (error) {
        console.log("Not logged in or error:", error);
        router.push("/login"); // redirect if not logged in
      }
    };

    checkAdmin();
  }, []);

  /* ===========================
     HANDLE IMAGE PREVIEWS
  ============================ */
  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm({ ...form, images: arr });
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  /* ===========================
     SAVE PRODUCT
  ============================ */
  const handleSaveProduct = async () => {
    try {
      const uploadedImages: string[] = [];

      // Upload images to Appwrite Storage
      if (form.images && form.images.length > 0) {
        for (const file of form.images) {
          if (file instanceof File) {
            const uploaded = await storage.createFile(
              process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
              ID.unique(),
              file,
              [Permission.read(Role.any())], // public read
            );
            uploadedImages.push(uploaded.$id);
          } else {
            // Keep existing image ID if it's already a string
            uploadedImages.push(file);
          }
        }
      }

      const payload = {
        name: form.name,
        price: form.price,
        category: form.category,
        description: form.description,
        materials: form.materials,
        inStock: form.in_stock,
        isBestSeller: form.is_best_seller,
        isNewArrival: form.is_new_arrival,
        colors: form.colors
          ? form.colors
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        sizes: form.sizes
          ? form.sizes
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        images: uploadedImages.length > 0 ? uploadedImages : form.images, // keep old images if editing
      };

      if (editingProduct) {
        await databases.updateDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          editingProduct,
          payload,
        );
        toast.success("Product updated");
      } else {
        await databases.createDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          ID.unique(),
          payload,
        );
        toast.success("Product created");
      }

      setProductDialogOpen(false);
      setEditingProduct(null);
      setForm(emptyProduct);
      setImagePreviews([]);
      fetchProducts();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Error saving product");
    }
  };

  /* ===========================
     DELETE PRODUCT
  ============================ */
  const handleDeleteProduct = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Error deleting product");
    }
  };

  const openEditProduct = (p: DbProduct) => {
    setEditingProduct(p.$id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      materials: p.materials,
      in_stock: p.in_stock,
      is_best_seller: p.is_best_seller,
      is_new_arrival: p.is_new_arrival,
      colors: p.colors?.join(", ") || "",
      sizes: p.sizes?.join(", ") || "",
      images: p.images || [],
    });
    setImagePreviews(
      p.images?.map(
        (id) =>
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${id}/view`,
      ) || [],
    );
    setProductDialogOpen(true);
  };

  function handleUpdateOrderStatus($id: string, v: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        {/* ================= PRODUCTS TAB ================= */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Dialog
              open={productDialogOpen}
              onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) {
                  setEditingProduct(null);
                  setForm(emptyProduct);
                  setImagePreviews([]);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {editingProduct ? "Edit Product" : "Add Product"}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "New Product"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (KSh)</Label>
                      <Input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => setForm({ ...form, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Materials</Label>
                    <Input
                      value={form.materials}
                      onChange={(e) =>
                        setForm({ ...form, materials: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Colors (comma-separated)</Label>
                    <Input
                      value={form.colors}
                      onChange={(e) =>
                        setForm({ ...form, colors: e.target.value })
                      }
                      placeholder="Natural, Sage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sizes (comma-separated)</Label>
                    <Input
                      value={form.sizes}
                      onChange={(e) =>
                        setForm({ ...form, sizes: e.target.value })
                      }
                      placeholder="S, M, L"
                    />
                  </div>

                  {/* ================= Image Upload ================= */}
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files)}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          className="h-20 w-20 object-cover rounded-md border"
                          alt={`preview-${i}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.in_stock}
                        onCheckedChange={(v) =>
                          setForm({ ...form, in_stock: v })
                        }
                      />
                      <Label>In Stock</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.is_best_seller}
                        onCheckedChange={(v) =>
                          setForm({ ...form, is_best_seller: v })
                        }
                      />
                      <Label>Best Seller</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.is_new_arrival}
                        onCheckedChange={(v) =>
                          setForm({ ...form, is_new_arrival: v })
                        }
                      />
                      <Label>New Arrival</Label>
                    </div>
                  </div>

                  <Button onClick={handleSaveProduct} className="w-full mt-4">
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Product table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.$id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="capitalize">{p.category}</TableCell>
                    <TableCell>{formatPrice(p.price)}</TableCell>
                    <TableCell>{p.in_stock ? "✓" : "✗"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditProduct(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(p.$id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No products yet. Add your first product above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ================= ORDERS TAB ================= */}
        <TabsContent value="orders">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.$id}>
                    <TableCell>
                      {new Date(o.$createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{o.customer_name}</TableCell>
                    <TableCell>{o.customer_phone}</TableCell>
                    <TableCell>{formatPrice(o.total)}</TableCell>
                    <TableCell className="capitalize">{o.status}</TableCell>
                    <TableCell>
                      <Select
                        value={o.status}
                        onValueChange={(v) => handleUpdateOrderStatus(o.$id, v)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
