"use client";

import {
  Text,
  Sparkline,
  Frame,
  Rectangle,
  Circle,
  Avatar,
  Badge,
  Line,
  Image,
  BarChart,
  DonutChart,
  LineChart,
  ProgressBar,
  Edge,
  Arrow,
  Icon,
} from "./atomics";

interface GalleryItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function GalleryItem({ title, description, children, fullWidth }: GalleryItemProps) {
  return (
    <div className={`flex flex-col gap-4 p-6 rounded-2xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div>
        <Text variant="h3" color="primary">{title}</Text>
        <Text variant="small" color="muted">{description}</Text>
      </div>
      <div className="flex flex-wrap items-center gap-4 min-h-[60px]">
        {children}
      </div>
    </div>
  );
}

export function AtomicGallery() {
  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <div className="text-center mb-8">
        <Text variant="h1" color="primary">Atomic Gallery</Text>
        <Text variant="body" color="muted" className="mt-2">
          All available atomic components for schema composition
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text */}
        <GalleryItem title="Text" description="Typography with variants and colors">
          <div className="flex flex-col gap-2">
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="body">Body text</Text>
            <Text variant="small" color="muted">Small muted</Text>
          </div>
        </GalleryItem>

        {/* Badge */}
        <GalleryItem title="Badge" description="Status labels and tags">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </GalleryItem>

        {/* Avatar */}
        <GalleryItem title="Avatar" description="Profile images with fallbacks">
          <div className="flex items-center gap-4">
            <Avatar size={32} name="John Doe" />
            <Avatar size={40} name="Jane Smith" />
            <Avatar size={48} name="Alex" />
            <Avatar size={56} />
          </div>
        </GalleryItem>

        {/* Icon */}
        <GalleryItem title="Icon" description="Lucide icons with custom sizing and colors">
          <div className="flex items-center gap-4">
            <Icon name="Home" size={24} color="var(--g0-text-primary)" />
            <Icon name="Settings" size={24} color="var(--g0-text-muted)" />
            <Icon name="CheckCircle" size={28} color="var(--g0-status-success)" />
            <Icon name="AlertTriangle" size={28} color="var(--g0-status-warning)" />
            <Icon name="XCircle" size={28} color="var(--g0-status-error)" />
            <Icon name="TrendingUp" size={24} color="var(--g0-accent-violet)" />
            <Icon name="Star" size={24} color="var(--g0-accent-amber)" />
          </div>
        </GalleryItem>

        {/* Sparkline */}
        <GalleryItem title="Sparkline" description="Mini trend charts">
          <div className="flex items-center gap-6">
            <Sparkline
              data={[10, 25, 15, 30, 22, 35, 28, 40, 38, 45]}
              width={100}
              height={32}
              color="var(--g0-accent-amber)"
            />
            <Sparkline
              data={[45, 38, 40, 28, 35, 22, 30, 15, 25, 10]}
              width={100}
              height={32}
              color="var(--g0-accent-rose)"
            />
            <Sparkline
              data={[20, 25, 22, 28, 25, 30, 28, 32, 30, 35]}
              width={100}
              height={32}
              color="var(--g0-accent-violet)"
            />
          </div>
        </GalleryItem>

        {/* Shapes */}
        <GalleryItem title="Shapes" description="Rectangle and Circle primitives">
          <div className="flex items-center gap-4">
            <Rectangle
              width={60}
              height={40}
              fill="var(--g0-accent-violet)"
              radius={8}
              opacity={0.8}
            />
            <Rectangle
              width={50}
              height={50}
              stroke="var(--g0-accent-amber)"
              strokeWidth={2}
              radius={4}
            />
            <Circle
              radius={25}
              fill="var(--g0-accent-rose)"
              opacity={0.8}
            />
            <Circle
              radius={20}
              stroke="var(--g0-accent-amber)"
              strokeWidth={2}
            />
          </div>
        </GalleryItem>

        {/* Background Images & Gradients */}
        <GalleryItem title="Background Images" description="Shapes with gradient and image backgrounds">
          <div className="flex items-center gap-4">
            <Rectangle
              width={80}
              height={60}
              radius={8}
              backgroundImage="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <Rectangle
              width={60}
              height={60}
              radius={8}
              backgroundImage="radial-gradient(circle, #f97316 0%, #ea580c 100%)"
            />
            <Circle
              radius={30}
              backgroundImage="conic-gradient(from 0deg, #22c55e, #3b82f6, #a855f7, #ec4899, #22c55e)"
            />
            <Frame
              width={100}
              height={60}
              backgroundImage="linear-gradient(45deg, var(--g0-accent-amber), var(--g0-accent-rose))"
              border={{ color: "transparent", width: 0, radius: 12 }}
            />
          </div>
        </GalleryItem>

        {/* Frame */}
        <GalleryItem title="Frame" description="Container with styling">
          <Frame
            width={200}
            height={80}
            padding={16}
            background="var(--g0-bg-elevated-2)"
            border={{
              color: "var(--g0-accent-violet)",
              width: 1,
              radius: 12,
            }}
          >
            <Text variant="small" color="muted">Content inside frame</Text>
          </Frame>
        </GalleryItem>

        {/* Line */}
        <GalleryItem title="Line" description="Dividers and separators">
          <div className="flex flex-col gap-4 w-full">
            <Line width={200} stroke="var(--g0-bg-elevated-3)" />
            <Line width={150} stroke="var(--g0-accent-violet)" strokeWidth={2} />
            <div className="flex items-center gap-4">
              <Line height={40} orientation="vertical" stroke="var(--g0-text-muted)" />
              <Line height={40} orientation="vertical" stroke="var(--g0-accent-amber)" strokeWidth={2} />
            </div>
          </div>
        </GalleryItem>

        {/* Image */}
        <GalleryItem title="Image" description="Image display with fallback">
          <div className="flex items-center gap-4">
            <Image
              width={80}
              height={60}
              radius={8}
            />
            <Image
              width={60}
              height={60}
              radius={30}
            />
          </div>
        </GalleryItem>

        {/* ProgressBar */}
        <GalleryItem title="ProgressBar" description="Linear, circular, and gauge progress indicators" fullWidth>
          <div className="flex items-center gap-8 w-full">
            <div className="flex-1">
              <ProgressBar
                value={75}
                variant="linear"
                label="Completion"
                color="var(--g0-accent-violet)"
              />
            </div>
            <ProgressBar
              value={68}
              variant="circular"
              size={80}
              color="var(--g0-accent-amber)"
              label="Score"
            />
            <ProgressBar
              value={42}
              variant="gauge"
              size={100}
              color="var(--g0-accent-rose)"
              label="Risk"
            />
          </div>
        </GalleryItem>

        {/* BarChart */}
        <GalleryItem title="BarChart" description="Vertical bar chart with hover tooltips">
          <BarChart
            data={[
              { label: "Jan", value: 65 },
              { label: "Feb", value: 80 },
              { label: "Mar", value: 45 },
              { label: "Apr", value: 90 },
              { label: "May", value: 72 },
            ]}
            width={280}
            height={160}
            showLabels
            onBarClick={(data) => console.log("Clicked:", data)}
          />
        </GalleryItem>

        {/* DonutChart */}
        <GalleryItem title="DonutChart" description="Arc-based chart with hover and click">
          <DonutChart
            data={[
              { label: "Stocks", value: 45, color: "var(--g0-accent-violet)" },
              { label: "Bonds", value: 25, color: "var(--g0-accent-amber)" },
              { label: "Real Estate", value: 20, color: "var(--g0-accent-rose)" },
              { label: "Cash", value: 10, color: "#22c55e" },
            ]}
            width={160}
            height={160}
            centerValue="$1.2M"
            centerLabel="Total"
            showLabels
            onSegmentClick={(data) => console.log("Clicked:", data)}
          />
        </GalleryItem>

        {/* LineChart */}
        <GalleryItem title="LineChart" description="Line chart with area fill and hover crosshair" fullWidth>
          <LineChart
            data={[
              { x: "Jan", y: 30 },
              { x: "Feb", y: 45 },
              { x: "Mar", y: 35 },
              { x: "Apr", y: 60 },
              { x: "May", y: 55 },
              { x: "Jun", y: 80 },
              { x: "Jul", y: 75 },
            ]}
            width={500}
            height={180}
            showGrid
            showArea
            showDots
            color="var(--g0-accent-violet)"
          />
        </GalleryItem>

        {/* Connectors - Edge & Arrow */}
        <GalleryItem title="Connectors" description="Edge and Arrow with various styles" fullWidth>
          <div className="relative w-full h-[200px]">
            {/* Straight Arrow */}
            <Arrow
              from={{ x: 50, y: 50 }}
              to={{ x: 200, y: 50 }}
              stroke="var(--g0-accent-violet)"
              strokeWidth={2}
            />
            <div className="absolute left-[50px] top-[30px] text-xs text-[var(--g0-text-muted)]">Straight</div>

            {/* Curved Edge */}
            <Edge
              from={{ x: 50, y: 100 }}
              to={{ x: 200, y: 100 }}
              variant="curved"
              arrow="end"
              stroke="var(--g0-accent-amber)"
              strokeWidth={2}
            />
            <div className="absolute left-[50px] top-[80px] text-xs text-[var(--g0-text-muted)]">Curved</div>

            {/* Step Edge */}
            <Edge
              from={{ x: 50, y: 150 }}
              to={{ x: 200, y: 180 }}
              variant="step"
              arrow="both"
              stroke="var(--g0-accent-rose)"
              strokeWidth={2}
            />
            <div className="absolute left-[50px] top-[130px] text-xs text-[var(--g0-text-muted)]">Step</div>

            {/* Animated Dashed */}
            <Edge
              from={{ x: 250, y: 50 }}
              to={{ x: 400, y: 100 }}
              variant="curved"
              arrow="end"
              stroke="#22c55e"
              strokeWidth={2}
              dashed
              animated
              label="flow"
            />
            <div className="absolute left-[250px] top-[30px] text-xs text-[var(--g0-text-muted)]">Animated</div>

            {/* Animated with particle */}
            <Edge
              from={{ x: 250, y: 140 }}
              to={{ x: 400, y: 180 }}
              variant="straight"
              arrow="end"
              stroke="#3b82f6"
              strokeWidth={2}
              animated
            />
            <div className="absolute left-[250px] top-[120px] text-xs text-[var(--g0-text-muted)]">Particle</div>
          </div>
        </GalleryItem>
      </div>

      {/* Color reference */}
      <div className="mt-12 p-6 rounded-2xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)]">
        <Text variant="h3" color="primary" className="mb-4">Color Tokens</Text>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--g0-accent-amber)]" />
            <Text variant="small" color="muted">amber</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--g0-accent-violet)]" />
            <Text variant="small" color="muted">violet</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--g0-accent-rose)]" />
            <Text variant="small" color="muted">rose</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--g0-text-primary)]" />
            <Text variant="small" color="muted">primary</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
