import { Suspense } from "react";

import Container from "@/components/layout/container";
import { SearchFilter } from "@/components/shared/search-filter";
import { Events } from "../components/events";

const EventsPage = () => {
  return (
    <Container>
      <SearchFilter />

      <Suspense>
        <Events />
      </Suspense>
    </Container>
  );
};

export default EventsPage;
