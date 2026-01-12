import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES} from '@constants/index';

interface RiskFactor {
  id: string;
  title: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
  active: boolean;
}

const RiskAwarenessScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate risk factors based on static rules (non-AI)
    const hour = currentTime.getHours();
    const factors: RiskFactor[] = [];

    // Time-based risk
    if (hour >= 22 || hour <= 6) {
      factors.push({
        id: 'night-time',
        title: 'Late Night Hours',
        level: 'high',
        description: 'It\'s late night. Stay extra aware of your surroundings and consider using trusted transportation.',
        icon: '🌙',
        active: true,
      });
    } else if (hour >= 20 || hour <= 7) {
      factors.push({
        id: 'evening-hours',
        title: 'Evening Hours',
        level: 'medium',
        description: 'Visibility is reduced. Stay in well-lit areas and let someone know your route.',
        icon: '🌆',
        active: true,
      });
    }

    // Weekend risk (higher social activity)
    const dayOfWeek = currentTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      factors.push({
        id: 'weekend',
        title: 'Weekend',
        level: 'medium',
        description: 'Weekend nights often have increased activity. Stay alert in social settings.',
        icon: '📅',
        active: true,
      });
    }

    // Weather-based (mock - in real app, would integrate weather API)
    factors.push({
      id: 'weather',
      title: 'Weather Conditions',
      level: 'low',
      description: 'Clear weather expected. Good visibility for outdoor activities.',
      icon: '☀️',
      active: false,
    });

    // Location familiarity (mock - would use user's location history)
    factors.push({
      id: 'location',
      title: 'Area Familiarity',
      level: 'low',
      description: 'You\'re in a familiar area. Normal awareness recommended.',
      icon: '📍',
      active: false,
    });

    // Battery level (mock - would use device battery API)
    factors.push({
      id: 'battery',
      title: 'Device Battery',
      level: 'low',
      description: 'Device battery is sufficient. Keep your phone charged for safety.',
      icon: '🔋',
      active: false,
    });

    setRiskFactors(factors);
  }, [currentTime]);

  const getOverallRiskLevel = () => {
    const activeFactors = riskFactors.filter(f => f.active);
    if (activeFactors.some(f => f.level === 'high')) return 'high';
    if (activeFactors.some(f => f.level === 'medium')) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.success;
      default: return COLORS.textLight;
    }
  };

  const getSafetyTips = () => {
    const hour = currentTime.getHours();
    const tips = [];

    if (hour >= 22 || hour <= 6) {
      tips.push('🚗 Use trusted ride-sharing apps');
      tips.push('📞 Keep your phone easily accessible');
      tips.push('👥 Share your location with trusted contacts');
      tips.push('🏠 Stay in well-lit, populated areas');
    } else if (hour >= 20 || hour <= 7) {
      tips.push('🔦 Carry a small flashlight');
      tips.push('📱 Keep your ringer on');
      tips.push('👀 Walk facing traffic when possible');
      tips.push('🛡️ Avoid shortcuts through isolated areas');
    } else {
      tips.push('☀️ Stay hydrated in hot weather');
      tips.push('👂 Be aware of your surroundings');
      tips.push('📞 Keep emergency contacts updated');
      tips.push('🎧 Use headphones at low volume');
    }

    return tips;
  };

  const overallRisk = getOverallRiskLevel();
  const safetyTips = getSafetyTips();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Awareness</Text>
        <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.riskCard, {borderColor: getRiskColor(overallRisk)}]}>
            <View style={styles.riskHeader}>
              <Text style={styles.riskTitle}>Current Risk Level</Text>
              <View style={[styles.riskIndicator, {backgroundColor: getRiskColor(overallRisk)}]} />
            </View>
            <Text style={[styles.riskLevel, {color: getRiskColor(overallRisk)}]}>
              {overallRisk.toUpperCase()}
            </Text>
            <Text style={styles.riskDescription}>
              {overallRisk === 'high' && 'High risk detected. Take extra precautions.'}
              {overallRisk === 'medium' && 'Moderate risk. Stay alert and aware.'}
              {overallRisk === 'low' && 'Low risk. Normal awareness recommended.'}
            </Text>
          </View>

          <View style={styles.factorsSection}>
            <Text style={styles.sectionTitle}>Risk Factors</Text>
            {riskFactors.map(factor => (
              <View key={factor.id} style={styles.factorCard}>
                <View style={styles.factorHeader}>
                  <Text style={styles.factorIcon}>{factor.icon}</Text>
                  <View style={styles.factorInfo}>
                    <Text style={styles.factorTitle}>{factor.title}</Text>
                    <View style={[
                      styles.riskBadge,
                      {backgroundColor: getRiskColor(factor.level)},
                    ]}>
                      <Text style={styles.riskBadgeText}>
                        {factor.level.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusIndicator,
                    {backgroundColor: factor.active ? getRiskColor(factor.level) : COLORS.textLight},
                  ]} />
                </View>
                <Text style={styles.factorDescription}>
                  {factor.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Safety Tips</Text>
            {safetyTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xl2,
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  time: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SIZES.lg,
  },
  riskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  riskTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  riskLevel: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    marginTop: SIZES.sm,
  },
  riskDescription: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  factorsSection: {
    marginBottom: SIZES.xl2,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  factorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  factorIcon: {
    fontSize: 24,
    marginRight: SIZES.base,
  },
  factorInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  factorTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  riskBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
    alignSelf: 'flex-start',
  },
  riskBadgeText: {
    fontSize: SIZES.xs,
    color: COLORS.surface,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  factorDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  tipsSection: {
    marginBottom: SIZES.xl2,
  },
  tipCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radiusBase,
    padding: SIZES.base,
    marginBottom: SIZES.sm,
  },
  tipText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default RiskAwarenessScreen;
