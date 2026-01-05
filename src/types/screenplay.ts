import { BaseEditor} from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type ScreenplayText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type ScreenplayType = 
  | 'paragraph'
  | 'scene-heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'slugline';

export type ScreenplayElement = {
  type: ScreenplayType;
  children: ScreenplayText[];
  align?: string;
};

export type CustomElement = ScreenplayElement;
export type CustomText = ScreenplayText;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}