import { Avatar, AvatarGroup, Badge, Chip, Table } from "@heroui/react";
import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

const AVATAR_URLS = {
  blue: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
  green:
    "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
  orange:
    "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
  purple:
    "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
  red: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
};

export function DataDisplaySection() {
  return (
    <ShowcaseSection
      id="data-display"
      title="Data Display"
      description="Avatar / AvatarGroup / Badge / Chip / Table"
    >
      <DemoBlock title="Avatar">
        <Avatar>
          <Avatar.Image alt="Jane Doe" src={AVATAR_URLS.blue} />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Avatar>
          <Avatar.Fallback>JR</Avatar.Fallback>
        </Avatar>
      </DemoBlock>

      <DemoBlock title="Avatar Group">
        <AvatarGroup>
          <Avatar>
            <Avatar.Image alt="User 1" src={AVATAR_URLS.blue} />
            <Avatar.Fallback>ZM</Avatar.Fallback>
          </Avatar>
          <Avatar>
            <Avatar.Image alt="User 2" src={AVATAR_URLS.green} />
            <Avatar.Fallback>LH</Avatar.Fallback>
          </Avatar>
          <Avatar>
            <Avatar.Image alt="User 3" src={AVATAR_URLS.purple} />
            <Avatar.Fallback>WF</Avatar.Fallback>
          </Avatar>
          <Avatar>
            <Avatar.Image alt="User 4" src={AVATAR_URLS.orange} />
            <Avatar.Fallback>LY</Avatar.Fallback>
          </Avatar>
        </AvatarGroup>
      </DemoBlock>

      <DemoBlock title="Badge">
        <Badge.Anchor>
          <Avatar>
            <Avatar.Image alt="User" src={AVATAR_URLS.green} />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
          <Badge color="danger" size="sm">
            5
          </Badge>
        </Badge.Anchor>
        <Badge.Anchor>
          <Avatar>
            <Avatar.Image alt="User" src={AVATAR_URLS.red} />
            <Avatar.Fallback>CD</Avatar.Fallback>
          </Avatar>
          <Badge color="success" placement="bottom-right" size="sm" />
        </Badge.Anchor>
      </DemoBlock>

      <DemoBlock title="Chip">
        <Chip>Default</Chip>
        <Chip color="accent">Accent</Chip>
        <Chip color="success">Success</Chip>
        <Chip color="warning">Warning</Chip>
        <Chip color="danger">Danger</Chip>
      </DemoBlock>

      <DemoBlock title="Table">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Team members" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Kate Moore</Table.Cell>
                  <Table.Cell>CEO</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>John Smith</Table.Cell>
                  <Table.Cell>CTO</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Sara Johnson</Table.Cell>
                  <Table.Cell>CMO</Table.Cell>
                  <Table.Cell>On leave</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </DemoBlock>
    </ShowcaseSection>
  );
}
