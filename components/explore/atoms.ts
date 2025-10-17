import { atom } from 'jotai';

import { exploreInfo } from '@/constants';

export const projectAtom = atom(exploreInfo.projects[0]);
export const activeSectionAtom = atom(exploreInfo.sections[0]);
// Timestamp of the latest navbar-triggered navigation jump
export const navJumpAtom = atom<number>(0);
