import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

interface Props {
  onUpload: (results: any) => void;
}

function UploadButton(props: Props) {
  const { onUpload } = props;

  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => {
        return (
          <Button size={"sm"} variant={"secondary"} {...getRootProps()}>
            <Upload className="h-4 w-4" />
            <span className="ml-2">Upload CSV</span>
          </Button>
        );
      }}
    </CSVReader>
  );
}

export default UploadButton;
