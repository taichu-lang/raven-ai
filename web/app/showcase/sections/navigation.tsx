"use client";

import { Accordion, Breadcrumbs, Pagination, Tabs } from "@heroui/react";
import { useState } from "react";

import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

const ACCORDION_ITEMS = [
  {
    title: "How do I place an order?",
    content:
      "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
  },
  {
    title: "Can I modify or cancel my order?",
    content:
      "Yes, you can modify or cancel your order before it ships. Once an order enters processing, it can no longer be changed.",
  },
  {
    title: "What payment methods are accepted?",
    content: "We accept major credit cards, including Visa, Mastercard, and American Express.",
  },
];

export function NavigationSection() {
  return (
    <ShowcaseSection
      id="navigation"
      title="Navigation"
      description="Tabs / Accordion / Breadcrumbs / Pagination"
    >
      <DemoBlock title="Tabs">
        <Tabs className="w-full max-w-md">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id="overview">
                Overview
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="analytics">
                Analytics
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="reports">
                Reports
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id="overview">
            <p>See an overview of the project and recent activity.</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="analytics">
            <p>Track metrics and analyze performance data.</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="reports">
            <p>Generate and download detailed reports.</p>
          </Tabs.Panel>
        </Tabs>
      </DemoBlock>

      <DemoBlock title="Accordion">
        <Accordion className="w-full max-w-md">
          {ACCORDION_ITEMS.map((item, index) => (
            <Accordion.Item key={index}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  {item.title}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>{item.content}</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </DemoBlock>

      <DemoBlock title="Breadcrumbs">
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Electronics</Breadcrumbs.Item>
          <Breadcrumbs.Item>Laptops</Breadcrumbs.Item>
        </Breadcrumbs>
      </DemoBlock>

      <DemoBlock title="Pagination">
        <PaginationDemo />
      </DemoBlock>
    </ShowcaseSection>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  const totalPages = 5;

  return (
    <Pagination className="justify-center">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
            <Pagination.PreviousIcon />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
              {p}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === totalPages}
            onPress={() => setPage((p) => p + 1)}
          >
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
