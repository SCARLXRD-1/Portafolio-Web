'use client';

import React from 'react';
import { useWindowStore, AppId } from '@/store/useWindowStore';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';
// We will import Apps here later
import TerminalApp from '../apps/TerminalApp';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import SkillsApp from '../apps/SkillsApp';
import ContactApp from '../apps/ContactApp';
import ExperimentsApp from '../apps/ExperimentsApp';
import BrowserApp from '../apps/BrowserApp';
import CertificatesApp from '../apps/CertificatesApp';
import ExperienceApp from '../apps/ExperienceApp';
import SettingsApp from '../apps/SettingsApp';

const APP_COMPONENTS: Record<AppId, React.ComponentType<any>> = {
  terminal: TerminalApp,
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  contact: ContactApp,
  experiments: ExperimentsApp,
  browser: BrowserApp,
  certificates: CertificatesApp,
  experience: ExperienceApp,
  settings: SettingsApp,
};

export default function WindowManager() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <AnimatePresence>
      {Object.values(windows).map((win) => {
        if (!win.isOpen) return null;

        const AppComponent = APP_COMPONENTS[win.id as AppId];
        return (
          <Window key={win.id} id={win.id}>
            <AppComponent />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
