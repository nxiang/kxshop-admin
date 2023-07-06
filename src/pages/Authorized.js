import React from 'react';
import { Navigate } from 'react-router-dom';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Navigate to="/user/login" />}>
    {children}
  </Authorized>
);
