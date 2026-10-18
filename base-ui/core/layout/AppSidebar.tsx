"use client";

import { Avatar, cn, Dropdown, Label, Separator } from "@heroui/react";
import { useConversationScroller } from "base-ui/hooks/useConversationMutations";
import { usePreference } from "base-ui/hooks/usePreference";
import { useRavenPlatform } from "base-ui/platform";
import { Conversation } from "base-ui/types/chat";
import { usePathname, useRouter } from "hero-next/i18n/navigation";
import { InfiniteScrollView, InfiniteScrollViewHandle, Item, Sidebar } from "hero-next/layout";
import { useTheme } from "hero-next/theme";
import {
  BlocksIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LanguagesIcon,
  LogOutIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  SettingsIcon,
  SquarePenIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { getConversations } from "./lib";

function Languages() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setLocale } = usePreference();

  const switchLocale = (key: string) => {
    setLocale(key);
    router.replace(pathname, { locale: key });
  };

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        <LanguagesIcon className="text-muted size-4 shrink-0" />
        <Label>{t("sidebar.language")}</Label>
        <ChevronRightIcon className="text-muted ms-auto size-4 shrink-0" />
      </Dropdown.Item>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectedKeys={[locale]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key) {
              switchLocale(key as string);
            }
          }}
        >
          <Dropdown.Item id="zh" textValue="中文">
            <Dropdown.ItemIndicator />
            <Label>中文</Label>
          </Dropdown.Item>
          <Dropdown.Item id="en" textValue="English">
            <Dropdown.ItemIndicator />
            <Label>English</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}

function Themes() {
  const t = useTranslations();
  const { theme, setTheme } = usePreference();
  const { setTheme: setThemeMode } = useTheme();

  const switchTheme = (key: string) => {
    setTheme(key);
    setThemeMode(key);
  };

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        <PaletteIcon className="text-muted size-4 shrink-0" />
        <Label>{t("sidebar.theme")}</Label>
        <ChevronRightIcon className="text-muted ms-auto size-4 shrink-0" />
      </Dropdown.Item>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectedKeys={[theme]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key) {
              switchTheme(key as string);
            }
          }}
        >
          <Dropdown.Item id="light" textValue={t("sidebar.themeLight")}>
            <Dropdown.ItemIndicator />
            <Label>{t("sidebar.themeLight")}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue={t("sidebar.themeDark")}>
            <Dropdown.ItemIndicator />
            <Label>{t("sidebar.themeDark")}</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}

function Preferences() {
  const t = useTranslations();

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        <PaletteIcon className="text-muted size-4 shrink-0" />
        <Label>{t("sidebar.preferences")}</Label>
        <ChevronRightIcon className="text-muted ms-auto size-4 shrink-0" />
      </Dropdown.Item>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Languages />
          <Themes />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}

function ProfileDropdown() {
  const t = useTranslations();

  return (
    <Dropdown>
      <Dropdown.Trigger className={"hover:bg-default flex w-full items-center gap-2 rounded-2xl p-1"}>
        <Avatar size="sm">A</Avatar>
        <div className="flex flex-col text-start">
          <p className="text-sm">leo</p>
          <p className="text-xs text-gray-500">{t("sidebar.plan")}</p>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Popover className={"w-64"}>
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 text-sm">
          <Avatar size="sm" className="h-6 w-6">
            A
          </Avatar>
          leo
        </div>
        <Dropdown.Menu
          onSelectionChange={(keys) => console.log(keys)}
          selectionMode="single"
          onAction={(key) => console.log(key)}
        >
          <Dropdown.Item href="/profile">{t("sidebar.profile")}</Dropdown.Item>
          <Preferences />
          <Dropdown.Item href="/settings">
            <SettingsIcon className="text-muted size-4 shrink-0" />
            {t("sidebar.settings")}
          </Dropdown.Item>
          <Separator className="my-0.5" />
          <Dropdown.Item className="text-danger hover:bg-danger-soft-hover">
            <LogOutIcon className="text-danger size-4 shrink-0" />
            {t("sidebar.signOut")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function Header() {
  return <Sidebar.Header>Raven</Sidebar.Header>;
}

interface ExtensionMenu {
  id: string;
}

function Body() {
  const t = useTranslations();
  const ref = useRef<InfiniteScrollViewHandle | null>(null);
  const { setScrollRef } = useConversationScroller();
  const { baseUrl, conversationRouter } = useRavenPlatform();

  useEffect(() => {
    if (ref.current) {
      setScrollRef(ref);
    }
  }, [setScrollRef]);

  return (
    <InfiniteScrollView<Conversation | ExtensionMenu>
      handleRef={ref}
      className="px-2"
      sections={[
        {
          key: "extensions",
          getItemKey: (item) => {
            const menu = item as ExtensionMenu;
            return menu.id;
          },
          fetch: async () => {
            return [{ id: "extensions" }];
          },
          collapsible: false,
          showWhenEmpty: true,
        },
        {
          key: "recent",
          getItemKey: (item) => {
            const conversation = item as Conversation;
            return conversation.id.toString();
          },
          fetch: async ({ after, limit, signal }) => {
            const from = after ? Number(after) : 0;
            return await getConversations(baseUrl, from, limit, signal);
          },
          collapsible: true,
          showWhenEmpty: false,
        },
      ]}
      renderItem={(item, meta) => {
        if (meta.sectionKey === "extensions") {
          return (
            <div className="flex flex-col">
              <Sidebar.Item href="/extensions" icon={<BlocksIcon className="size-4 shrink-0" />}>
                {t("sidebar.extensions")}
              </Sidebar.Item>
              <Sidebar.Item href="/channels" icon={<MonitorSmartphoneIcon className="size-4 shrink-0" />}>
                {t("sidebar.channels")}
              </Sidebar.Item>
              <div className="mt-4">
                <p className="px-2 text-sm">{t("sidebar.tasks")}</p>
                <Separator className="my-2" />
              </div>
            </div>
          );
        }

        const conversation = item as Conversation;
        return (
          <Item href={conversationRouter(conversation.conversation_id)}>
            <Item.Content>{conversation.title}</Item.Content>
          </Item>
        );
      }}
      renderHeader={(selectionKey, meta) => {
        if (selectionKey === "recent") {
          return <SectionHeader title={t("sidebar.recent")} collapsed={meta.collapsed} onClick={meta.toggle} />;
        }

        return null;
      }}
    />
  );
}

function SectionHeader({
  title,
  collapsed,
  onClick,
}: {
  title: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={"text-muted bg-background flex w-full cursor-pointer items-center gap-4 px-2 pb-1.75 text-xs"}
      data-collapsed={collapsed ? "true" : undefined}
      onClick={onClick}
    >
      {title}
      <ChevronDownIcon className={cn("size-4 transition-transform duration-200", collapsed && "-rotate-90")} />
    </div>
  );
}

export function AppSidebar() {
  const t = useTranslations();

  return (
    <Sidebar>
      <Header />
      <nav className="mt-2 flex justify-center px-2">
        <Sidebar.Item href="/" icon={<SquarePenIcon className="size-4 shrink-0" />}>
          {t("sidebar.newTask")}
        </Sidebar.Item>
      </nav>
      <Body />
      <Sidebar.Footer>
        <ProfileDropdown />
      </Sidebar.Footer>
    </Sidebar>
  );
}
