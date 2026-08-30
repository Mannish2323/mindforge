'use client';

// WhiteboardIcons.tsx — Compatibility shim
// All icons now live in the unified MFIcon system.
export { MFIcon, type MFIconType, type MFIconProps } from './MFIcon';
export type WhiteboardIconProps = import('./MFIcon').MFIconProps;
export type MFIconName = import('./MFIcon').MFIconType;
