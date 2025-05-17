import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Dreams: undefined,
    About: undefined,
    DreamEditor: {dream: Dream} | undefined,
    DreamViewer: {dream: Dream} | undefined,
    ImageEditor: {dream: Dream},
    NewDreamPrompt: {dream: Dream},
}

export type Dream = {
    id: string,
    title: string,
    description: string,
    date: string,
    AIDescription?: string,
    image?: string,
    useAIDescription: boolean,
}