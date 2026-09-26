import { Alert, Label, ProgressBar, Skeleton, Spinner } from "@heroui/react";
import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

const SPINNER_SIZES = ["sm", "md", "lg", "xl"] as const;

export function FeedbackSection() {
  return (
    <ShowcaseSection
      id="feedback"
      title="Feedback"
      description="Alert / ProgressBar / Spinner / Skeleton"
    >
      <DemoBlock title="Alert">
        <div className="grid w-full gap-4">
          <Alert>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>New feature available</Alert.Title>
              <Alert.Description>
                Check out the latest updates, including dark mode support.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Profile updated</Alert.Title>
            </Alert.Content>
          </Alert>
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Scheduled maintenance</Alert.Title>
              <Alert.Description>
                The service will be unavailable this weekend.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Unable to connect to server</Alert.Title>
              <Alert.Description>
                Please check your network connection.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </DemoBlock>

      <DemoBlock title="Progress Bar">
        <ProgressBar aria-label="Loading" className="w-64" value={60}>
          <Label>Loading</Label>
          <ProgressBar.Output />
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </DemoBlock>

      <DemoBlock title="Spinner">
        {SPINNER_SIZES.map((size) => (
          <Spinner key={size} size={size} />
        ))}
      </DemoBlock>

      <DemoBlock title="Skeleton">
        <div className="w-[250px] space-y-5 rounded-lg p-4">
          <Skeleton className="h-32 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
          </div>
        </div>
      </DemoBlock>
    </ShowcaseSection>
  );
}
