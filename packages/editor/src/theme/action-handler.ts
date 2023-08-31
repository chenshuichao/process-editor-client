import { SwitchThemeAction, ThemeMode } from '@axonivy/process-editor-protocol';
import { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class SwitchThemeActionHandler implements IActionHandler {
  theme(): ThemeMode {
    return (document.documentElement.dataset.theme as ThemeMode) ?? SwitchThemeActionHandler.prefsColorScheme();
  }

  handle(action: Action): void | Action | ICommand {
    if (SwitchThemeAction.is(action)) {
      document.documentElement.dataset.theme = action.theme;
    }
  }

  static prefsColorScheme(): ThemeMode {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
