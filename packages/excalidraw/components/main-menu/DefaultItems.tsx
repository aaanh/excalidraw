import { getShortcutFromShortcutName } from "../../actions/shortcuts";
import { useI18n } from "../../i18n";
import {
  useExcalidrawSetAppState,
  useExcalidrawActionManager,
  useExcalidrawElements,
  useAppProps,
} from "../App";
import {
  boltIcon,
  DeviceDesktopIcon,
  ExportIcon,
  ExportImageIcon,
  HelpIcon,
  LoadIcon,
  MoonIcon,
  save,
  searchIcon,
  SunIcon,
  TrashIcon,
  usersIcon,
} from "../icons";
import { GithubIcon, DiscordIcon, XBrandIcon } from "../icons";
import DropdownMenuItem from "../dropdownMenu/DropdownMenuItem";
import DropdownMenuItemLink from "../dropdownMenu/DropdownMenuItemLink";
import {
  actionClearCanvas,
  actionLoadScene,
  actionSaveToActiveFile,
  actionShortcuts,
  actionToggleSearchMenu,
  actionToggleTheme,
} from "../../actions";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { activeConfirmDialogAtom } from "../ActiveConfirmDialog";
import { jotaiScope } from "../../jotai";
import { useUIAppState } from "../../context/ui-appState";
import { openConfirmModal } from "../OverwriteConfirm/OverwriteConfirmState";
import Trans from "../Trans";
import DropdownMenuItemContentRadio from "../dropdownMenu/DropdownMenuItemContentRadio";
import { THEME } from "../../constants";
import type { Theme } from "../../element/types";
import { trackEvent } from "../../analytics";
import "./DefaultItems.scss";

export const LoadScene = () => {
  const { t } = useI18n();
  const actionManager = useExcalidrawActionManager();
  const elements = useExcalidrawElements();

  if (!actionManager.isActionEnabled(actionLoadScene)) {
    return null;
  }

  const handleSelect = async () => {
    if (
      !elements.length ||
      (await openConfirmModal({
        title: t("overwriteConfirm.modal.loadFromFile.title"),
        actionLabel: t("overwriteConfirm.modal.loadFromFile.button"),
        color: "warning",
        description: (
          <Trans
            i18nKey="overwriteConfirm.modal.loadFromFile.description"
            bold={(text) => <strong>{text}</strong>}
            br={() => <br />}
          />
        ),
      }))
    ) {
      actionManager.executeAction(actionLoadScene);
    }
  };

  return (
    <DropdownMenuItem
      icon={LoadIcon}
      onSelect={handleSelect}
      data-testid="load-button"
      shortcut={getShortcutFromShortcutName("loadScene")}
      aria-label={t("buttons.load")}
    >
      {t("buttons.load")}
    </DropdownMenuItem>
  );
};
LoadScene.displayName = "LoadScene";

export const SaveToActiveFile = () => {
  const { t } = useI18n();
  const actionManager = useExcalidrawActionManager();

  if (!actionManager.isActionEnabled(actionSaveToActiveFile)) {
    return null;
  }

  return (
    <DropdownMenuItem
      shortcut={getShortcutFromShortcutName("saveScene")}
      data-testid="save-button"
      onSelect={() => actionManager.executeAction(actionSaveToActiveFile)}
      icon={save}
      aria-label={`${t("buttons.save")}`}
    >{`${t("buttons.save")}`}</DropdownMenuItem>
  );
};
SaveToActiveFile.displayName = "SaveToActiveFile";

export const SaveAsImage = () => {
  const setAppState = useExcalidrawSetAppState();
  const { t } = useI18n();
  return (
    <DropdownMenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => setAppState({ openDialog: { name: "imageExport" } })}
      shortcut={getShortcutFromShortcutName("imageExport")}
      aria-label={t("buttons.exportImage")}
    >
      {t("buttons.exportImage")}
    </DropdownMenuItem>
  );
};
SaveAsImage.displayName = "SaveAsImage";

export const CommandPalette = (opts?: { className?: string }) => {
  const setAppState = useExcalidrawSetAppState();
  const { t } = useI18n();

  return (
    <DropdownMenuItem
      icon={boltIcon}
      data-testid="command-palette-button"
      onSelect={() => {
        trackEvent("command_palette", "open", "menu");
        setAppState({ openDialog: { name: "commandPalette" } });
      }}
      shortcut={getShortcutFromShortcutName("commandPalette")}
      aria-label={t("commandPalette.title")}
      className={opts?.className}
    >
      {t("commandPalette.title")}
    </DropdownMenuItem>
  );
};
CommandPalette.displayName = "CommandPalette";

export const SearchMenu = (opts?: { className?: string }) => {
  const { t } = useI18n();
  const actionManager = useExcalidrawActionManager();

  return (
    <DropdownMenuItem
      icon={searchIcon}
      data-testid="search-menu-button"
      onSelect={() => {
        actionManager.executeAction(actionToggleSearchMenu);
      }}
      shortcut={getShortcutFromShortcutName("searchMenu")}
      aria-label={t("search.title")}
      className={opts?.className}
    >
      {t("search.title")}
    </DropdownMenuItem>
  );
};
SearchMenu.displayName = "SearchMenu";

export const Help = () => {
  const { t } = useI18n();

  const actionManager = useExcalidrawActionManager();

  return (
    <DropdownMenuItem
      data-testid="help-menu-item"
      icon={HelpIcon}
      onSelect={() => actionManager.executeAction(actionShortcuts)}
      shortcut="?"
      aria-label={t("helpDialog.title")}
    >
      {t("helpDialog.title")}
    </DropdownMenuItem>
  );
};
Help.displayName = "Help";

export const ClearCanvas = () => {
  const { t } = useI18n();

  const setActiveConfirmDialog = useSetAtom(
    activeConfirmDialogAtom,
    jotaiScope,
  );
  const actionManager = useExcalidrawActionManager();

  if (!actionManager.isActionEnabled(actionClearCanvas)) {
    return null;
  }

  return (
    <DropdownMenuItem
      icon={TrashIcon}
      onSelect={() => setActiveConfirmDialog("clearCanvas")}
      data-testid="clear-canvas-button"
      aria-label={t("buttons.clearReset")}
    >
      {t("buttons.clearReset")}
    </DropdownMenuItem>
  );
};
ClearCanvas.displayName = "ClearCanvas";

export const ToggleTheme = (
  props:
    | {
        allowSystemTheme: true;
        theme: Theme | "system";
        onSelect: (theme: Theme | "system") => void;
      }
    | {
        allowSystemTheme?: false;
        onSelect?: (theme: Theme) => void;
      },
) => {
  const { t } = useI18n();
  const appState = useUIAppState();
  const actionManager = useExcalidrawActionManager();
  const shortcut = getShortcutFromShortcutName("toggleTheme");

  if (!actionManager.isActionEnabled(actionToggleTheme)) {
    return null;
  }

  if (props?.allowSystemTheme) {
    return (
      <DropdownMenuItemContentRadio
        name="theme"
        value={props.theme}
        onChange={(value: Theme | "system") => props.onSelect(value)}
        choices={[
          {
            value: THEME.LIGHT,
            label: SunIcon,
            ariaLabel: `${t("buttons.lightMode")} - ${shortcut}`,
          },
          {
            value: THEME.DARK,
            label: MoonIcon,
            ariaLabel: `${t("buttons.darkMode")} - ${shortcut}`,
          },
          {
            value: "system",
            label: DeviceDesktopIcon,
            ariaLabel: t("buttons.systemMode"),
          },
        ]}
      >
        {t("labels.theme")}
      </DropdownMenuItemContentRadio>
    );
  }

  return (
    <DropdownMenuItem
      onSelect={(event) => {
        // do not close the menu when changing theme
        event.preventDefault();

        if (props?.onSelect) {
          props.onSelect(
            appState.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK,
          );
        } else {
          return actionManager.executeAction(actionToggleTheme);
        }
      }}
      icon={appState.theme === THEME.DARK ? SunIcon : MoonIcon}
      data-testid="toggle-dark-mode"
      shortcut={shortcut}
      aria-label={
        appState.theme === THEME.DARK
          ? t("buttons.lightMode")
          : t("buttons.darkMode")
      }
    >
      {appState.theme === THEME.DARK
        ? t("buttons.lightMode")
        : t("buttons.darkMode")}
    </DropdownMenuItem>
  );
};
ToggleTheme.displayName = "ToggleTheme";

export const ChangeCanvasBackground = () => {
  const { t } = useI18n();
  const appState = useUIAppState();
  const actionManager = useExcalidrawActionManager();
  const appProps = useAppProps();

  if (
    appState.viewModeEnabled ||
    !appProps.UIOptions.canvasActions.changeViewBackgroundColor
  ) {
    return null;
  }
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        data-testid="canvas-background-label"
        style={{ fontSize: ".75rem", marginBottom: ".5rem" }}
      >
        {t("labels.canvasBackground")}
      </div>
      <div style={{ padding: "0 0.625rem" }}>
        {actionManager.renderAction("changeViewBackgroundColor")}
      </div>
    </div>
  );
};
ChangeCanvasBackground.displayName = "ChangeCanvasBackground";

export const Export = () => {
  const { t } = useI18n();
  const setAppState = useExcalidrawSetAppState();
  return (
    <DropdownMenuItem
      icon={ExportIcon}
      onSelect={() => {
        setAppState({ openDialog: { name: "jsonExport" } });
      }}
      data-testid="json-export-button"
      aria-label={t("buttons.export")}
    >
      {t("buttons.export")}
    </DropdownMenuItem>
  );
};
Export.displayName = "Export";

export const Socials = () => {
  const { t } = useI18n();

  return (
    <>
      <DropdownMenuItemLink
        icon={GithubIcon}
        href="https://github.com/excalidraw/excalidraw"
        aria-label="GitHub"
      >
        GitHub
      </DropdownMenuItemLink>
      <DropdownMenuItemLink
        icon={XBrandIcon}
        href="https://x.com/excalidraw"
        aria-label="X"
      >
        {t("labels.followUs")}
      </DropdownMenuItemLink>
      <DropdownMenuItemLink
        icon={DiscordIcon}
        href="https://discord.gg/UexuTaE"
        aria-label="Discord"
      >
        {t("labels.discordChat")}
      </DropdownMenuItemLink>
    </>
  );
};
Socials.displayName = "Socials";

export const LiveCollaborationTrigger = ({
  onSelect,
  isCollaborating,
}: {
  onSelect: () => void;
  isCollaborating: boolean;
}) => {
  const { t } = useI18n();
  return (
    <DropdownMenuItem
      data-testid="collab-button"
      icon={usersIcon}
      className={clsx({
        "active-collab": isCollaborating,
      })}
      onSelect={onSelect}
    >
      {t("labels.liveCollaboration")}
    </DropdownMenuItem>
  );
};

export const SyncGithub = () => {
  return (
    <DropdownMenuItem
      data-testid="sync-github-button"
      icon={GithubIcon}
      onSelect={async () => {
        let github_pat = localStorage.getItem("github_pat");
        const data = localStorage.getItem("excalidraw");

        if (!github_pat) {
          github_pat = prompt("Enter your Github Personal Access Token");
          localStorage.setItem("github_pat", github_pat ?? "");
        } else {
          const GITHUB_API_URL = "https://api.github.com";
          const GITHUB_API_VERSION = "2022-11-28";
          const GITHUB_REPO = "excalisync-data";
          const headers = new Headers({
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${github_pat}`,
            "X-GitHub-Api-Version": GITHUB_API_VERSION,
          });
          const GITHUB_OWNER = await (
            await fetch(`${GITHUB_API_URL}/user`, {
              headers,
            })
          ).json();
          const create_repository = await fetch(
            `${GITHUB_API_URL}/user/repos`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                name: GITHUB_REPO,
                description:
                  "Automatically created by ExcaliSync to save Excalidraw data",
                private: true,
                is_template: false,
              }),
            },
          );
          console.log(await create_repository.json());
          const get_file = await (
            await fetch(
              `${GITHUB_API_URL}/repos/${GITHUB_OWNER.login}/${GITHUB_REPO}/contents/data.json`,
              {
                headers,
              },
            )
          ).json();
          const upload_data = await (
            await fetch(
              `${GITHUB_API_URL}/repos/${GITHUB_OWNER.login}/${GITHUB_REPO}/contents/data.json`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  committer: {
                    name: GITHUB_OWNER.name,
                    email: GITHUB_OWNER.email,
                  },
                  message: `Synced at ${new Date().toISOString()}`,
                  content: btoa(JSON.stringify(data)),
                  sha: get_file.sha,
                }),
              },
            )
          ).json();
          console.log(upload_data);
          alert(JSON.stringify(upload_data));
        }
      }}
    >
      Sync to Github
    </DropdownMenuItem>
  );
};

export const GetDataFromGithub = () => {
  return (
    <DropdownMenuItem
      data-testid="sync-github-button"
      icon={GithubIcon}
      onSelect={async () => {
        let github_pat = localStorage.getItem("github_pat");
        const data = localStorage.getItem("excalidraw");

        if (!github_pat) {
          github_pat = prompt("Enter your Github Personal Access Token");
          localStorage.setItem("github_pat", github_pat ?? "");
        } else {
          const GITHUB_API_URL = "https://api.github.com";
          const GITHUB_API_VERSION = "2022-11-28";
          const GITHUB_REPO = "excalisync-data";
          const headers = new Headers({
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${github_pat}`,
            "X-GitHub-Api-Version": GITHUB_API_VERSION,
          });
          const GITHUB_OWNER = await (
            await fetch(`${GITHUB_API_URL}/user`, {
              headers,
            })
          ).json();
          const create_repository = await fetch(
            `${GITHUB_API_URL}/user/repos`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                name: GITHUB_REPO,
                description:
                  "Automatically created by ExcaliSync to save Excalidraw data",
                private: true,
                is_template: false,
              }),
            },
          );
          console.log(await create_repository.json());
          const get_file = await (
            await fetch(
              `${GITHUB_API_URL}/repos/${GITHUB_OWNER.login}/${GITHUB_REPO}/contents/data.json`,
              {
                headers,
              },
            )
          ).json();
          const data = get_file.content;
          const decoded_data = atob(data);
          console.log(decoded_data);
          localStorage.setItem("excalidraw", decoded_data);
          alert("Data successfully fetched from Github");
        }
      }}
    >
      Download from Github
    </DropdownMenuItem>
  );
};

LiveCollaborationTrigger.displayName = "LiveCollaborationTrigger";
