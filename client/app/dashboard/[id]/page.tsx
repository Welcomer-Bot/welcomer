export default function Page({ params }: { params: { id: string } }) {
  return <div>My Guild: {params.id}</div>;
}
