import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type ScreenplayType = 
  | 'scene-heading' 
  | 'action' 
  | 'character' 
  | 'dialogue' 
  | 'parenthetical' 
  | 'transition';

export type ScreenplayElement = {
  type: ScreenplayType;
  children: CustomText[];
};

export type CustomText = {
  text: string;
  bold?: boolean; 
  italic?: boolean;     
  underline?: boolean;
};
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: ScreenplayElement;
    Text: CustomText;
  }
}