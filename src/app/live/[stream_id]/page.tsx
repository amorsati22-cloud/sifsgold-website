import { LiveStreamViewer } from "./LiveStreamViewer";

type Props = { params: { stream_id: string } };

export default function LiveStreamPage({ params }: Props) {
  return <LiveStreamViewer streamId={params.stream_id} />;
}
