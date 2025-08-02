"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Container,
  Button,
} from "react-bootstrap";
import useMounted from "hooks/useMounted";

const ProfilePage = () => {
  const hasMounted = useMounted();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProfileAndProducts = async () => {
      try {
        const profileRes = await fetch(
          "https://api.escuelajs.co/api/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileRes.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await profileRes.json();
        setUser(userData);

        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProducts();
  }, []);

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center bg-light py-5"
    >
      <Row className="w-100 justify-content-center g-4">
        <Col xxl={10} lg={11} md={12}>
          <Card className="p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Selamat Datang</h2>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {error && (
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
              >
                {error}
              </Alert>
            )}

            {hasMounted && (
              <>
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" role="status" />
                    <p className="mt-2">Loading data...</p>
                  </div>
                ) : (
                  <Row className="g-4">
                    <Col md={4}>
                      <h4 className="mb-3">User Profile</h4>
                      {user && (
                        <Card>
                          <Card.Body>
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text mb-1">
                              <strong>Email:</strong> {user.email}
                            </p>
                            <p className="card-text">
                              <strong>Role:</strong> {user.role}
                            </p>
                          </Card.Body>
                        </Card>
                      )}
                    </Col>

                    <Col md={8}>
                      <h4 className="mb-3">Products</h4>
                      <Card>
                        <Card.Body className="p-0">
                          <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="mb-0"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Product Brand</th>
                                <th>Product Owner</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.length > 0 ? (
                                products.map((product) => (
                                  <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                      {product["Product Name"] ||
                                        product.product_name}
                                    </td>
                                    <td>
                                      {product["Product Brand"] ||
                                        product.product_brand}
                                    </td>
                                    <td>
                                      {product["Product Owner"] ||
                                        product.product_owner ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No products found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
