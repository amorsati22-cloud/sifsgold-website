import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { PROGRAM_LABELS } from "@/lib/state-board/constants";
import type { ProgramType } from "@/types/state-board";

type Props = {
  stateName: string;
  program: ProgramType;
};

export function StateBoardNotifyConfirmation({ stateName, program }: Props) {
  const programLabel = PROGRAM_LABELS[program] ?? program;
  return (
    <EmailLayout preview={`${stateName} ${programLabel} prep — we'll notify you`}>
      <Heading className="font-heading text-gold text-xl">You&apos;re on the list</Heading>
      <Text className="text-cream/90">
        We&apos;ll email you when {stateName} {programLabel} state board prep is published on Sif&apos;s
        Gold — with the full 300-question bank, timed practice exams, and category analytics.
      </Text>
      <Text className="text-cream/70 text-sm">
        Texas, California, Florida, New York, and Pennsylvania are live now at sifsgold.com/state-board-prep.
      </Text>
    </EmailLayout>
  );
}
