import {
  Accordion,
  ActionIcon,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Loader,
  Table,
  Text,
  createStyles,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconAt,
  IconCheck,
  IconPhone,
  IconServerBolt,
} from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { ProductContext } from '../contexts/ProductContext';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  panel: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[7]
        : theme.colors.gray[1],
  },
  controlText: {
    display: 'block',
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
  button: {
    marginTop: theme.spacing.sm,
    marginLeft: 10,
    width: 120,
  },
  circleButton: {
    marginTop: theme.spacing.md,
    marginLeft: 10,
  },
}));

export interface Order {
  _id: string;
  userId: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    zipCode: number;
    phoneNumber: number;
  };
  orderItems: {
    _id: string;
    quantity: number;
  }[];
  isShipped: boolean;
  totalPrice: number;
  createdAt: string;
}

export function AdminOrderAccordion({ order }: { order: Order }) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const { allCreatedProducts } = useContext(ProductContext);
  const [isShipped, setIsShipped] = useState(order.isShipped);

  const shippedClick = (orderId: string) => {
    changeShippedStatus(orderId);
  };

  const changeShippedStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to change shipped status');
      }

      const message = await response.json();
      setIsShipped(message.status);
      notifications.show({
        icon: <IconCheck />,
        title: 'Success!',
        message: 'The orders shipping status has been updated',
        color: 'green',
        autoClose: 3000,
        withCloseButton: false,
      });
    } catch (error) {
      notifications.show({
        icon: <IconServerBolt size={20} />,
        title: 'Error',
        message: 'Failed to update order shipping status',
        color: 'red',
        autoClose: false,
      });
      console.error('Failed to update order shipping status:', error);
    }
  };

  return (
    <Container className={classes.wrapper}>
      <Accordion.Item
        className={classes.item}
        key={order._id}
        value={order._id}
      >
        <Accordion.Control>
          <Flex justify="space-between">
            <Flex sx={{ flex: 2, [theme.fn.smallerThan('sm')]: { flex: 3 } }}>
              <Text size="md" weight={700}>
                #{order._id}
              </Text>
            </Flex>

            <Flex
              sx={{
                flex: 2,
                [theme.fn.smallerThan('sm')]: {
                  flex: 3,
                  justifyContent: 'center',
                },
              }}
            >
              <Text size="md" weight={500}>
                {new Date(order.createdAt).toISOString().split('T')[0]}
              </Text>
            </Flex>

            <Flex
              sx={{ flex: 1, justifyContent: 'flex-end' }}
              className={classes.controlText}
            >
              <Text size="md" weight={500}>
                {order.userId}
              </Text>
            </Flex>
          </Flex>
        </Accordion.Control>

        <Accordion.Panel className={classes.panel}>
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Flex direction="column" style={{ flex: 2, marginRight: '2rem' }}>
              <Table verticalSpacing="xs">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => {
                    const product = allCreatedProducts.find(
                      (product) => product._id === item._id,
                    );

                    return (
                      <tr key={item._id}>
                        <td>{product ? product.title : 'Product not found'}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {product
                            ? `€${product.price}`
                            : 'Price not available'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Flex
                justify="flex-end"
                align="flex-end"
                style={{ height: '100%' }}
              >
                <Text>Total price: €{order.totalPrice}</Text>
              </Flex>
            </Flex>
            <Flex direction="column" style={{ flex: 1 }}>
              <Card shadow="xs" padding="md">
                <Flex
                  direction="column"
                  align={{ base: 'center', md: 'flex-start' }}
                >
                  <Text>
                    {order.deliveryAddress.firstName}{' '}
                    {order.deliveryAddress.lastName}
                  </Text>
                  <Text>{order.deliveryAddress.street}</Text>
                  <Text>
                    {order.deliveryAddress.zipCode},{' '}
                    {order.deliveryAddress.city}
                  </Text>
                  <Text>
                    <Divider variant="dashed" my="md" />
                    <IconAt size={18} /> {order.deliveryAddress.email}
                  </Text>
                  <Text>
                    <IconPhone size={18} /> {order.deliveryAddress.phoneNumber}
                  </Text>
                </Flex>
                <Flex direction="column"></Flex>
              </Card>
            </Flex>
          </Flex>
          <Text mt={6} ml={3} display={{ base: 'block', sm: 'none' }}>
            Ordered by: {order.userId}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
      {isSmallScreen ? (
        isShipped ? (
          <ActionIcon
            radius="lg"
            variant="light"
            color="green"
            className={classes.circleButton}
            onClick={() => shippedClick(order._id)}
          >
            <IconCheck size={25} />
          </ActionIcon>
        ) : (
          <ActionIcon
            radius="lg"
            variant="light"
            color="yellow"
            className={classes.circleButton}
            onClick={() => shippedClick(order._id)}
          >
            <Loader color="yellow" size="sm" />
          </ActionIcon>
        )
      ) : isShipped ? (
        <Button
          variant="light"
          color="green"
          className={classes.button}
          onClick={() => shippedClick(order._id)}
        >
          Shipped
        </Button>
      ) : (
        <Button
          variant="outline"
          color="red"
          className={classes.button}
          onClick={() => shippedClick(order._id)}
        >
          Not Shipped
        </Button>
      )}
    </Container>
  );
}
