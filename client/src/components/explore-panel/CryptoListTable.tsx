import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CryptoListTable() {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Market Cap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">1</TableCell>
          <TableCell>Bitcoin</TableCell>
          <TableCell>
            <span>$</span>70,000
          </TableCell>
          <TableCell className="text-right">
            <span>$</span>1,360,915,644,546
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">2</TableCell>
          <TableCell>Ethereum</TableCell>
          <TableCell>
            <span>$</span>4000
          </TableCell>
          <TableCell className="text-right">
            <span>$</span>424,449,098,451
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">3</TableCell>
          <TableCell>Solana</TableCell>
          <TableCell>
            <span>$</span>200
          </TableCell>
          <TableCell className="text-right">
            <span>$</span>$76,299,526,296
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
