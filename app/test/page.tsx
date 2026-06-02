async function getData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
  );

  return {
    status: res.status,
  };
}

export default async function TestPage() {
  const data = await getData();

  return (
    <div>
      <h1>Backend Test</h1>
      <p>Status: {data.status}</p>
    </div>
  );
}