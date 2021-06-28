// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import {
  Provider,
  teamsTheme,
  Loader,
  mergeThemes,
} from '@fluentui/react-northstar';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { useTeamsFx } from './components/sample/lib/useTeamsFx';
import Privacy from './pages/Privacy';
import TermsOfUse from './pages/TermsOfUse';
import Tab from './pages/Tab';
import TabConfig from './pages/TabConfig';

const themeOverrides = {
  componentVariables: {
    // @ts-ignore
    Button: ({ colorScheme }) => ({
      color: colorScheme.brand.foreground,
    }),
    // @ts-ignore
    Card: ({ colorScheme }) => ({
      backgroundColor: colorScheme.default.background,
    }),
  },
  componentStyles: {
    Button: {
      // @ts-ignore
      root: ({ variables }) => ({
        //color: variables.color
      }),
    },
    Card: {
      // @ts-ignore
      root: ({ variables }) => ({
        backgroundColor: variables.backgroundColor,
        borderRadius: '5px',
        '&:hover': {
          backgroundColor: variables.backgroundColor,
        },
      }),
    },
    CardColumn: {
      root: {
        overflow: 'hidden',
      },
    },
    CardPreview: {
      root: {
        marginRight: '20px',
      },
    },
    FormLabel: {
      root: {
        fontSize: '12px',
        fontWeight: 600,
      },
    },
  },
};

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { theme, loading } = useTeamsFx();
  return (
    <Provider theme={mergeThemes(theme || teamsTheme, themeOverrides)}>
      <Router>
        <Route exact path="/">
          <Redirect to="/tab" />
        </Route>
        {loading ? (
          <Loader style={{ margin: 100 }} />
        ) : (
          <>
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route exact path="/tab" component={Tab} />
            <Route exact path="/config" component={TabConfig} />
          </>
        )}
      </Router>
    </Provider>
  );
}
