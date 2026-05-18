import { StreamControlRoom } from "./StreamControlRoom";

type Props = { params: { stream_id: string } };

export default function StreamControlPage({ params }: Props) {
  return <StreamControlRoom streamId={params.stream_id} />;
}
