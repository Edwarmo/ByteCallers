import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
// import Header from '../../ui/components/Header'; // Comentado temporalmente
import { User } from '../../types/Auth';

interface LayoutProps {
  user: User | null;
  children: React.ReactNode;
  onLogout: () => void;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  user,
  children,
  onLogout,
  showHeader = true,
}) => (
  <View style={styles.container}>
    {/* {showHeader && <Header user={user} onLogout={onLogout} />} */}
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'web' ? 0 : 50,
  },
  content: {
    flex: 1,
  },
});

export default React.memo(Layout);
