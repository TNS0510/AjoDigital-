import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../App';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: {
    user: any;
    profile: any;
    loading: boolean;
  };
  route?: string;
}

const customRender = (
  ui: ReactElement,
  { authContext, route = '/group/group-1', ...options }: CustomRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const defaultAuth = { 
      user: { uid: 'test-user-id', email: 'test@example.com' }, 
      profile: { uid: 'test-user-id', displayName: 'Test User', email: 'test@example.com', createdAt: Date.now() },
      loading: false,
    };

    return (
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={authContext || defaultAuth}>
          <Routes>
            <Route path="/group/:groupId" element={children} />
            <Route path="*" element={children} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
