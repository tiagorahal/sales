import Link from "next/link";

const Header= (): JSX.Element => {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 px-6 flex justify-start space-x-6 items-center">
        <Link href="/" passHref={true} legacyBehavior={true}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Upload
          </a>
        </Link>
        <Link href="/results" passHref={true} legacyBehavior={true}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Transactions
          </a>
        </Link>
        <Link href="/affiliatesProducers" passHref={true} legacyBehavior={true}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Affiliates & Producers
          </a>
        </Link>
        <Link href="/profits" passHref={true} legacyBehavior={true}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Profits
          </a>
        </Link>
      </div>
    </header>
  );
}

export default Header;