import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface Product {
  _id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface ContextValue {
  products: Product[];
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
}

export const ProductContext = createContext<ContextValue>(null as any);

interface Props {
  children: ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    };

    fetchProducts();
  }, []);

  async function deleteProduct(id: string) {
    await axios.delete(`/api/products/${id}`);
    setProducts((currentProducts) => {
      return currentProducts.filter((product) => product._id !== id);
    });
  }

  async function addProduct(product: Product) {
    const res = await axios.post('/api/products', product);
    setProducts((currentProducts) => [...currentProducts, res.data]);
  }

  async function updateProduct(updatedProduct: Product) {
    const res = await axios.put(
      `/api/products/${updatedProduct._id}`,
      updatedProduct,
    );

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === updatedProduct._id ? res.data : product,
      ),
    );
  }

  return (
    <ProductContext.Provider
      value={{ products, deleteProduct, addProduct, updateProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
