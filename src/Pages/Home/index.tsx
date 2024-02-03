import Title from "../../components/Title";
import { useClient } from "../../@hooks";

export default function Home() {
  const { client } = useClient();
  return (
    <div>
      <Title description="Home" />
      {client?.name}
    </div>
  );
}
