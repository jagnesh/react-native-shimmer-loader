import React from 'react';
import UiText from './UiText';
import UiView from './UiView';

interface TestComponentProps {
  isLoading?: boolean;
}

const TestComponent: React.FC<TestComponentProps> = ({ isLoading = false }) => {
  return (
    <UiView
      style={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        gap: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header Row: User Avatar, Name, Timestamp, Options Badge */}
      <UiView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* User Avatar Circle */}
        <UiView
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#3b82f6',
          }}
        />

        {/* User Details Column */}
        <UiView style={{ flex: 1, gap: 4 }}>
          <UiText style={{ fontSize: 16, fontWeight: '600', color: '#1e293b' }}>
            {!isLoading ? 'Alex Morgan' : ''}
          </UiText>
          <UiText style={{ fontSize: 12, color: '#64748b' }}>
            {!isLoading ? 'Product Designer • 2h ago' : ''}
          </UiText>
        </UiView>

        {/* Status Badge Box */}
        <UiView
          style={{
            width: 70,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#e2e8f0',
          }}
        />
      </UiView>

      {/* Main Content Area: Title & Description */}
      <UiView style={{ gap: 8 }}>
        <UiText style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a' }}>
          {!isLoading ? 'Building Modern React Native Shimmer Loaders' : ''}
        </UiText>
        <UiText style={{ fontSize: 14, color: '#475569', lineHeight: 20 }}>
          {!isLoading
            ? 'Creating dynamic skeleton loaders automatically from subview layout trees ensures seamless loading states across iOS and Android apps.'
            : ''}
        </UiText>
      </UiView>

      {/* Media Banner Box */}
      <UiView
        style={{
          height: 140,
          width: '100%',
          borderRadius: 12,
          backgroundColor: '#cbd5e1',
        }}
      />

      {/* Grid Stats Row: 3 Metric Columns */}
      <UiView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <UiView
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f1f5f9',
            gap: 4,
          }}
        >
          <UiText style={{ fontSize: 12, color: '#64748b' }}>
            {!isLoading ? 'Views' : ''}
          </UiText>
          <UiText
            style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}
          >
            {!isLoading ? '2.4k' : ''}
          </UiText>
        </UiView>

        <UiView
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f1f5f9',
            gap: 4,
          }}
        >
          <UiText style={{ fontSize: 12, color: '#64748b' }}>
            {!isLoading ? 'Likes' : ''}
          </UiText>
          <UiText
            style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}
          >
            {!isLoading ? '184' : ''}
          </UiText>
        </UiView>

        <UiView
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f1f5f9',
            gap: 4,
          }}
        >
          <UiText style={{ fontSize: 12, color: '#64748b' }}>
            {!isLoading ? 'Shares' : ''}
          </UiText>
          <UiText
            style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}
          >
            {!isLoading ? '42' : ''}
          </UiText>
        </UiView>
      </UiView>

      {/* Action Footer Buttons */}
      <UiView style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
        <UiView
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            backgroundColor: '#2563eb',
          }}
        />
        <UiView
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: '#e2e8f0',
          }}
        />
      </UiView>
    </UiView>
  );
};

export default TestComponent;
