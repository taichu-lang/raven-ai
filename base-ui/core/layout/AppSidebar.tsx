"use client";

import { Avatar, Dropdown, Label, Separator, Tabs } from "@heroui/react";
import { Sidebar } from "hero-next/layout";
import { useTheme } from "hero-next/theme";
import {
  BlocksIcon,
  ChevronRightIcon,
  LanguagesIcon,
  LogOutIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  SettingsIcon,
  SquarePenIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePreference } from "../hooks/usePreference";

function Languages() {
  const router = useRouter();
  const { locale, setLocale } = usePreference();

  const switchLocale = (key: string) => {
    router.push(`/${key}`);
    setLocale(key);
  };

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        <LanguagesIcon className="text-muted size-4 shrink-0" />
        <Label>语言</Label>
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
        <Label>主题</Label>
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
          <Dropdown.Item id="light" textValue="亮色">
            <Dropdown.ItemIndicator />
            <Label>亮色</Label>
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue="暗色">
            <Dropdown.ItemIndicator />
            <Label>暗色</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}

function Preferences() {
  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        <PaletteIcon className="text-muted size-4 shrink-0" />
        <Label>偏好设置</Label>
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
  return (
    <Dropdown>
      <Dropdown.Trigger className={"hover:bg-default flex w-full items-center gap-2 rounded-2xl p-1"}>
        <Avatar size="sm">A</Avatar>
        <div className="flex flex-col text-start">
          <p className="text-sm">leo</p>
          <p className="text-xs text-gray-500">个人免费版</p>
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
          <Dropdown.Item href="/profile">个人中心</Dropdown.Item>
          <Preferences />
          <Dropdown.Item href="/settings">
            <SettingsIcon className="text-muted size-4 shrink-0" />
            设置
          </Dropdown.Item>
          <Separator className="my-0.5" />
          <Dropdown.Item className="text-danger hover:bg-danger-soft-hover">
            <LogOutIcon className="text-danger size-4 shrink-0" />
            退出登录
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <Sidebar.Header>Raven</Sidebar.Header>
      <nav className="mx-2 mt-2">
        <Sidebar.Item href="/" icon={<SquarePenIcon className="size-4" />}>
          新任务
        </Sidebar.Item>
      </nav>
      <Sidebar.Body>
        <Sidebar.Item href="/extensions" icon={<BlocksIcon className="size-4" />}>
          扩展
        </Sidebar.Item>
        <Sidebar.Item href="/channels" icon={<MonitorSmartphoneIcon className="size-4" />}>
          频道
        </Sidebar.Item>
        <Tabs variant="secondary" className="mt-4">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id={"tasks"} className="w-fit">
                任务
                <Tabs.Indicator className="bg-accent-foreground" />
              </Tabs.Tab>
              <Tabs.Tab id={"channels"} className="w-fit">
                频道
                <Tabs.Indicator className="bg-accent-foreground" />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id={"tasks"}>任务</Tabs.Panel>
          <Tabs.Panel id="channels">频道</Tabs.Panel>
        </Tabs>
      </Sidebar.Body>
      <Sidebar.Footer>
        <ProfileDropdown />
      </Sidebar.Footer>
    </Sidebar>
  );
}
