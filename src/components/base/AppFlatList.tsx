import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export interface AppFlatListProps<T> extends FlatListProps<T> {}

export function AppFlatList<T>(props: AppFlatListProps<T>) {
  return <FlatList showsVerticalScrollIndicator={false} {...props} />;
}
