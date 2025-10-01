'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Authentication Error</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-danger">{getErrorMessage(error)}</p>
              <p>Error code: {error || 'Unknown'}</p>
              <Link href="/" passHref>
                <Button variant="primary">
                  Return to Home
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}