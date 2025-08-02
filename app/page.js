"use client";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="text-center shadow-sm p-4">
            <Card.Body>
              <h1 className="mb-4">Selamat Datang</h1>
              <Button variant="primary" size="lg" onClick={handleLogin}>
                Silakan Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
