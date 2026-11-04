"use client";

import { Avatar, Button, cn, Dropdown, Label, Separator } from "@heroui/react";
import { useAuth, useAuthExt, useAuthHydrated } from "base-ui/hooks/useAuth";
import { useConversationScroller } from "base-ui/hooks/useConversationMutations";
import { usePreference } from "base-ui/hooks/usePreference";
import { useRavenPlatform } from "base-ui/platform";
import { Conversation } from "base-ui/types/chat";
import { getUserName } from "base-ui/types/profile";
import { usePathname, useRouter } from "hero-next/i18n/navigation";
import { InfiniteScrollView, InfiniteScrollViewHandle, Item, Sidebar } from "hero-next/layout";
import { useTheme } from "hero-next/theme";
import {
  BlocksIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LanguagesIcon,
  LogOutIcon,
  MenuIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  SettingsIcon,
  SquarePenIcon,
  User2Icon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { getConversations } from "./lib";

/**
 * Restores the persisted preference on first load: rehydrates the store from
 * localStorage, then applies the saved theme and navigates to the saved locale
 * when it differs from the current URL locale.
 */
function PreferenceSync() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { setTheme } = useTheme();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const restore = async () => {
      await usePreference.persist.rehydrate();
      const { locale: savedLocale, theme: savedTheme } = usePreference.getState();
      if (savedTheme) {
        setTheme(savedTheme);
      }
      if (savedLocale && savedLocale !== locale) {
        router.replace(pathname, { locale: savedLocale });
      }
    };
    restore();
  }, [locale, pathname, router, setTheme]);

  return null;
}

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
  const user = useAuth((s) => s.user);
  const { logout } = useAuthExt();

  if (!user) return null;

  const name = getUserName(user);

  return (
    <Dropdown>
      <Dropdown.Trigger className={"hover:bg-default flex w-full items-center gap-2 rounded-xl p-1"}>
        <Avatar size="sm" color="danger" variant="soft">
          <Avatar.Fallback>{name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col text-start">
          <p className="text-sm">{name}</p>
          <p className="text-muted text-xs">{t("sidebar.plan")}</p>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Popover className={"w-64"}>
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 text-sm">
          <Avatar size="sm" variant="soft" color="danger">
            <Avatar.Fallback>{name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>
          {user.email}
        </div>
        <Dropdown.Menu
          selectionMode="single"
          onAction={(key) => {
            if (key === "signOut") logout();
          }}
        >
          <Dropdown.Item href="/profile">
            <User2Icon className="text-muted size-4 shrink-0" /> {t("sidebar.profile")}
          </Dropdown.Item>
          <Preferences />
          <Dropdown.Item href="/settings">
            <SettingsIcon className="text-muted size-4 shrink-0" />
            {t("sidebar.settings")}
          </Dropdown.Item>
          <Separator className="my-0.5" />
          <Dropdown.Item id="signOut" className="text-danger hover:bg-danger-soft-hover">
            <LogOutIcon className="text-danger size-4 shrink-0" />
            {t("sidebar.signOut")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function LoginModalTrigger() {
  const t = useTranslations();
  const handleClick = () => {
    const { toggleAuthModal } = useAuth.getState();
    toggleAuthModal(true);
  };

  return (
    <Button onClick={handleClick} className={"bg-foreground text-background w-full rounded-lg"}>
      {t("auth.login")}
    </Button>
  );
}

function FooterAccount() {
  const user = useAuth((s) => s.user);
  const hydrated = useAuthHydrated();

  // Reserve the space, otherwise the SSR html paints the logged-out state first and then swaps to the profile.
  // TODO(Leo): use Skeleton.
  if (!hydrated) {
    return <div className="h-10 w-full" aria-hidden />;
  }

  return user ? (
    <ProfileDropdown />
  ) : (
    <div className="flex w-full items-center gap-2">
      <LoginModalTrigger />
      <Dropdown>
        <Button isIconOnly className={"shrink-0 rounded-lg"} variant="secondary">
          <MenuIcon className="text-muted size-4 shrink-0" />
        </Button>
        <Dropdown.Popover placement="top end" className={"w-65"}>
          <Dropdown.Menu>
            <Languages />
            <Themes />
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
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
  const status = useAuth((s) => s.status);

  useEffect(() => {
    if (ref.current) {
      setScrollRef(ref);
    }
  }, [setScrollRef]);

  // Once login, reload recent conversations.
  useEffect(() => {
    if (status === "unknown") {
      return;
    }

    useConversationScroller.getState().reloadRecent();
  }, [status]);

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
            // Read at call time rather than from the render closure, so a refresh always sees the latest status.
            // `unknown` is skipped too: the session is verified shortly, and the effect above reloads afterwards.
            if (useAuth.getState().status !== "authenticated") {
              return [];
            }

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
    <>
      <PreferenceSync />
      <Sidebar>
        <Header />
        <nav className="mt-2 flex justify-center px-2">
          <Sidebar.Item href="/" icon={<SquarePenIcon className="size-4 shrink-0" />}>
            {t("sidebar.newTask")}
          </Sidebar.Item>
        </nav>
        <Body />
        <Sidebar.Footer>
          <FooterAccount />
        </Sidebar.Footer>
      </Sidebar>
    </>
  );
}
