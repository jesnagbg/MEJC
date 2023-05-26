import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import CartProduct from '../components/CartProduct';
import CheckoutForm from '../components/CheckoutForm';
import SignInForm from '../components/SignInForm';
import { useAuth } from '../contexts/AuthContext';
import { ProductContext } from '../contexts/ProductContext';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

function Cart() {
  const { cartProducts, cartQuantity } = useShoppingCart();
  const { products } = useContext(ProductContext);
  const { user } = useAuth();
  const theme = useMantineTheme();
  const isLightColorScheme = theme.colorScheme === 'light';
  const borderStyle = isLightColorScheme ? '1px #EEEEEE solid' : 'none';

  <Text weight={500} size={29}>
    total:{' '}
    {cartProducts.reduce((total, cartProduct) => {
      const product = products.find((i) => i._id === cartProduct._id);
      return total + (product?.price || 0) * cartProduct.quantity;
    }, 0)}
    €
  </Text>;

  if (cartQuantity < 1) {
    return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
        size="xs"
      >
        <img
          src="./assets/sad-cart.svg"
          alt="a sad box indicating that the cart is empty"
        />
        <Text
          style={{
            color: '#E92D37',
            fontWeight: '500',
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        >
          Oops! Your cart is empty!
        </Text>
        <Text>Looks like you haven´t added anything to your cart yet</Text>
        <Link to="/">
          <Button variant="light" mt="md" radius="md">
            Shop Now
          </Button>
        </Link>
      </Container>
    );
  } else {
    return (
      <Container
        size={'1680px'}
        sx={{ marginTop: '0.5rem', marginBottom: '2rem' }}
      >
        <Flex
          gap="3rem"
          wrap="wrap"
          direction="column"
          justify="center"
          align="center"
        >
          <Box>
            {cartProducts.map((product) => (
              <Fragment key={product._id}>
                <CartProduct cartItem={product} />
                <Divider mt="md" mb="sm" size="xs" />
              </Fragment>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '3rem',
              '@media(max-width:801px)': {
                justifyContent: 'center',
              },
            }}
          >
            {user ? (
              <CheckoutForm />
            ) : (
              <Container
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <SignInForm />
              </Container>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              <Card
                shadow="md"
                sx={{
                  width: '22rem',
                  display: 'flex',
                  gap: '1rem',
                  flexDirection: 'column',
                  justifyItems: 'center',
                  alignItems: 'center',
                  marginTop: '0.7rem',
                  marginBottom: '1rem',
                  border: borderStyle,
                  '@media(max-width:721px)': {
                    width: '20rem',
                  },
                }}
              >
                <Text weight={600} size={25}>
                  Summary:
                </Text>
                <Text weight={500} size={18}>
                  {cartProducts.map((cartproduct) => {
                    const product = products.find(
                      (i) => i._id === cartproduct._id,
                    );
                    return (
                      <Box
                        key={cartproduct._id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '1rem',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>{product?.title}</Text>
                        <Text weight={400}>
                          {cartproduct.quantity}x {product?.price}€
                        </Text>
                      </Box>
                    );
                  })}
                </Text>
                <Text data-cy="total-price" weight={500} size={29}>
                  total:{' '}
                  {cartProducts.reduce((total, cartProduct) => {
                    const product = products.find(
                      (i) => i._id === cartProduct._id,
                    );
                    return total + (product?.price || 0) * cartProduct.quantity;
                  }, 0)}
                  €
                </Text>
              </Card>
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Cart;
