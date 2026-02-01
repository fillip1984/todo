import Link from "next/link";
import { FaHome } from "react-icons/fa";

import Container from "~/components/my-ui/container";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <Container>
      <div className="mt-12 flex flex-col items-center gap-4">
        <h4>Page not found</h4>
        <Link href="/">
          <Button>
            <FaHome /> Go home
          </Button>
        </Link>
      </div>
    </Container>
  );
}
