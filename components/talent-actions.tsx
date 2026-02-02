import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBox from "./search-box";

export default function TalentActions() {
  return (
    <div className="flex items-center justify-between pb-16 md:pb-8 gap-6">
      <SearchBox />
      <div className="flex items-center gap-2 md:gap-5">
        <Select>
          <SelectTrigger className="md:w-[100px] rounded-full!">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Filter</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="md:w-[100px] rounded-full!">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Name</SelectItem>
            <SelectItem value="dark">Title</SelectItem>
            <SelectItem value="system">Skills</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
