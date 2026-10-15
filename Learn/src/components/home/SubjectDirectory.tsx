import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

import SectionHeading from "@/components/home/SectionHeading";
import SubjectCard from "@/components/home/SubjectCard";

import { departments } from "@/data/homeData";

import type {
  Department,
  Repository,
  Subject,
} from "@/types/home";

type Props = {
  repository: Repository;
  department: Department;
  onDepartmentChange: (department: Department) => void;
  subjects: Subject[];
  onSubjectPress: (subject: Subject) => void;
};

export default function SubjectDirectory({
  repository,
  department,
  onDepartmentChange,
  subjects,
  onSubjectPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View>
      <SectionHeading
        title="Subject Directory"
        subtitle="তোমার প্রয়োজনীয় subject বেছে নাও"
      />

      {repository === "HSC" && (
        <View style={styles.departmentArea}>
          <Text
            style={[
              styles.label,
              { color: colors.textMuted },
            ]}
          >
            বিভাগ:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {departments.map((item) => {
              const active = item === department;

              return (
                <Text
                  key={item}
                  onPress={() => onDepartmentChange(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : colors.surface,
                      borderColor: active
                        ? colors.primary
                        : colors.border,
                      color: active
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  {item}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.subjectList}>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onPress={onSubjectPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  departmentArea: {
    marginBottom: 13,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: 9,
  },

  chipsRow: {
    gap: 8,
    paddingBottom: 2,
  },

  chip: {
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: "700",
  },

  subjectList: {
    gap: 10,
    marginBottom: 27,
  },
});