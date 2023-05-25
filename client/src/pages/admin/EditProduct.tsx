import { Container, Group, Title } from '@mantine/core';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { ProductContext } from '../../contexts/ProductContext';

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, updateProduct, fetchProducts } =
    useContext(ProductContext);
  const productToEdit = products.find((product) => product._id === id);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container>
      <Group position="center" mb="xl">
        <Title>Edit Product</Title>
      </Group>
      <ProductForm
        onSubmit={updateProduct}
        addProduct={addProduct}
        isEditing={true}
        product={productToEdit}
      />
    </Container>
  );
}

export default EditProduct;
