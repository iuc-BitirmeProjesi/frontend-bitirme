<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Side Menu -->
    <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Task Annotation
          </h1>
          <UButton
            @click="navigateBack"
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-left"
          >
            Back
          </UButton>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Task ID: {{ taskId }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p class="text-red-800 dark:text-red-300 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6 p-6">
        <!-- Attributes Section -->
        <div v-if="taskData">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-2" />
            Attributes
          </h2>
          
          <div class="space-y-3">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Task ID</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.id }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project ID</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.projectId }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                  <p class="mt-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusColor(taskData.status)">
                      {{ taskData.status }}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Data Type</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parseDataType(taskData.dataType) }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Priority</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.priority }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(taskData.createdAt) }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Updated At</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(taskData.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Metadata Section -->
            <div v-if="parsedMetadata" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Metadata</h3>
              <div class="space-y-2">
                <div v-if="parsedMetadata.originalFileName">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original File</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parsedMetadata.originalFileName }}</p>
                </div>
                <div v-if="parsedMetadata.mimeType">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">MIME Type</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parsedMetadata.mimeType }}</p>
                </div>
                <div v-if="parsedMetadata.uuid">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">UUID</label>
                  <p class="mt-1 text-xs text-gray-600 dark:text-gray-300 font-mono">{{ parsedMetadata.uuid }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Annotations Section -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <UIcon name="i-heroicons-annotation" class="w-5 h-5 mr-2" />
            Annotations
            <span class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              {{ annotations.length }}
            </span>
          </h2>
          
          <!-- No annotations state -->
          <div v-if="annotations.length === 0" class="text-center py-8">
            <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">No Annotations</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Start annotating to see your work here.</p>
          </div>

          <!-- Annotations list -->
          <div v-else class="space-y-4">
            <div v-for="annotation in annotations" :key="annotation.id" 
                 class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    Annotation #{{ annotation.id }}
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getReviewStatusColor(annotation.reviewStatus)">
                    {{ annotation.reviewStatus }}
                  </span>
                </div>
              </div>
              
              <div class="space-y-2 text-xs">
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">User:</span>
                  <span class="ml-1 text-gray-900 dark:text-white">{{ annotation.userEmail }}</span>
                </div>
                
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                  <span class="ml-1 text-gray-900 dark:text-white">{{ formatDate(annotation.createdAt) }}</span>
                </div>
                
                <div v-if="annotation.isGroundTruth" class="flex items-center">
                  <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-500 mr-1" />
                  <span class="text-yellow-700 dark:text-yellow-300 font-medium">Ground Truth</span>
                </div>
                
                <div class="mt-3">
                  <span class="font-medium text-gray-500 dark:text-gray-400">Data:</span>
                  <pre class="mt-1 text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">{{ JSON.stringify(annotation.annotationData, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Annotation Workspace
          </h2>
          <div class="flex items-center space-x-4">
            <UButton variant="outline" size="sm">
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
              Refresh
            </UButton>
            <UButton color="primary" size="sm">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
              Save Annotation
            </UButton>
          </div>
        </div>
      </div>      <!-- Content Area -->
      <div class="flex-1 p-6 overflow-auto">
        <div v-if="taskData" class="h-full flex flex-col">
          <!-- Annotation Tools -->
          <div v-if="isImageTask" class="mb-4 flex items-center space-x-4">
            <button 
              v-for="tool in tools" 
              :key="tool"
              @click="selectTool(tool)"
              :class="['px-4 py-2 rounded transition-colors', 
                       currentTool === tool ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white']"
            >
              {{ tool }}
            </button>

            <!-- Complete Button -->
            <UButton 
              v-if="isAnnotating"
              @click="completeAnnotation"
              color="success"
              size="sm"
            >
              Complete
            </UButton>

            <!-- Cancel Button -->
            <UButton 
              v-if="isAnnotating"
              @click="cancelAnnotation"
              color="error"
              size="sm"
            >
              Cancel
            </UButton>
          </div>

          <!-- Canvas Container -->
          <div v-if="isImageTask" class="flex-1 flex items-center justify-center">
            <div class="relative" ref="canvasContainer">
              <canvas 
                ref="canvas"
                @click="handleClick"
                @mousemove="handleMouseMove"
                @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @dblclick="handleDoubleClick"
                class="border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
                :class="{ 
                  'cursor-crosshair': !isAnnotating && !isDragging && currentTool !== 'select',
                  'cursor-pointer': isAnnotating || (currentTool === 'select' && hoveredAnnotation !== null),
                  'cursor-move': isDragging,
                }"
              ></canvas>

              <!-- Annotation Tools Overlay -->
              <div 
                v-if="clickedAnnotation !== null && !isAnnotating && !isDragging"
                class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2 z-10 transition-opacity duration-200 border border-gray-200 dark:border-gray-600"
                :style="{
                  left: `${annotationToolsPosition.x}px`,
                  top: `${annotationToolsPosition.y}px`,
                }"
              >
                <button
                  @click="startEditing(clickedAnnotation)"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                  title="Edit"
                >
                  <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
                </button>
                <button
                  @click="deleteAnnotation(clickedAnnotation)"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                  title="Delete"
                >
                  <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                </button>
                <button
                  @click="toggleDragMode(clickedAnnotation)"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Drag"
                >
                  <UIcon name="i-heroicons-arrows-pointing-out" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Placeholder for other data types -->
          <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 dark:text-gray-400">
                Data type: {{ parseDataType(taskData.dataType) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Annotation interface for this data type will be implemented here.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Loading state for main content -->
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Loading task data...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TaskData {
  id: number
  projectId: number
  dataUrl: string
  dataType: string
  status: string
  assignedTo: number | null
  metadata: string
  priority: number
  createdAt: number
  updatedAt: number
}

interface Annotation {
  id: number
  taskId: number
  userId: number
  projectId: number
  annotationData: any
  isGroundTruth: boolean
  reviewStatus: string
  reviewerId: number | null
  createdAt: number
  updatedAt: number
  userEmail: string
}

interface TaskResponse {
  data: TaskData
}

interface AnnotationsResponse {
  data: Annotation[]
}

// Get route params
const route = useRoute()
const taskId = route.params.id as string

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const taskData = ref<TaskData | null>(null)
const annotations = ref<Annotation[]>([])

// Auth
const token = useCookie('auth_token')

// Canvas annotation interfaces
interface CanvasAnnotation {
  type: 'rectangle' | 'polygon'
  startPoint?: { x: number; y: number }
  width?: number
  height?: number
  points?: { x: number; y: number }[]
}

// Canvas refs and state
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

// Annotation tools state
const tools = ['select', 'rectangle', 'polygon']
const currentTool = ref('rectangle')
const isAnnotating = ref(false)
const startPoint = ref<{ x: number; y: number } | null>(null)
const currentPath = ref<{ x: number; y: number }[]>([])
const canvasAnnotations = ref<CanvasAnnotation[]>([])
const mousePosition = ref({ x: 0, y: 0 })

// Interaction state
const hoveredAnnotation = ref<number | null>(null)
const isDragging = ref(false)
const dragStartPosition = ref<{ x: number; y: number } | null>(null)
const selectedAnnotation = ref<number | null>(null)
const clickedAnnotation = ref<number | null>(null)
const annotationToolsPosition = ref({ x: 0, y: 0 })
const hoveredPoint = ref<number | null>(null)
const isOverAnnotation = ref(false)

// Computed properties
const isImageTask = computed(() => {
  if (!taskData.value) return false
  return parseDataType(taskData.value.dataType).toLowerCase().includes('image')
})

const parsedMetadata = computed(() => {
  if (!taskData.value?.metadata) return null
  try {
    return JSON.parse(taskData.value.metadata)
  } catch {
    return null
  }
})

// Methods
const fetchTaskData = async () => {
  try {
    if (!token.value) {
      throw new Error('Authentication required')
    }

    const response = await $fetch<TaskResponse>(`http://localhost:8787/api/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    taskData.value = response.data
  } catch (err) {
    console.error('Error fetching task data:', err)
    throw err
  }
}

const fetchAnnotations = async () => {
  try {
    if (!token.value) {
      throw new Error('Authentication required')
    }

    const response = await $fetch<AnnotationsResponse>(`http://localhost:8787/api/annotations/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    annotations.value = response.data
  } catch (err) {
    console.error('Error fetching annotations:', err)
    // Don't throw error for annotations, just log it
    annotations.value = []
  }
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch both task data and annotations
    await Promise.all([
      fetchTaskData(),
      fetchAnnotations()
    ])
    
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const navigateBack = () => {
  const router = useRouter()
  // Navigate back to the project page
  if (taskData.value) {
    router.push(`/projects/${taskData.value.projectId}`)
  } else {
    router.back()
  }
}

const parseDataType = (dataType: string) => {
  // Remove quotes if present
  return dataType.replace(/"/g, '')
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

// Canvas annotation methods
const initializeCanvas = () => {
  if (!canvas.value || !taskData.value?.dataUrl) return
  
  ctx.value = canvas.value.getContext('2d')
  
  // Load image and set canvas size
  const img = new Image()
  img.crossOrigin = 'anonymous' // Handle cross-origin images
  
  img.onload = () => {
    canvas.value!.width = img.width
    canvas.value!.height = img.height
    ctx.value!.drawImage(img, 0, 0)
    drawExistingAnnotations()
  }
  
  img.onerror = (error) => {
    console.error('Failed to load image:', error)
    console.log('Image URL:', taskData.value?.dataUrl)
  }
  
  img.src = taskData.value.dataUrl
}

const selectTool = (tool: string) => {
  if (isAnnotating.value) {
    cancelAnnotation()
  }
  currentTool.value = tool
}

const getCanvasPoint = (event: MouseEvent): { x: number; y: number } => {
  if (!canvas.value) return { x: 0, y: 0 }
  const rect = canvas.value.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

const handleClick = (event: MouseEvent) => {
  const point = getCanvasPoint(event)
  
  if (currentTool.value === 'rectangle') {
    if (!isAnnotating.value) {
      startPoint.value = point
      isAnnotating.value = true
    } else {
      completeRectangle(point)
    }
  } else if (currentTool.value === 'polygon') {
    if (!isAnnotating.value) {
      currentPath.value = [point]
      isAnnotating.value = true
    } else {
      // Check if clicking near first point to close polygon
      const firstPoint = currentPath.value[0]
      const distance = Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y)
      
      if (distance < 20 && currentPath.value.length > 2) {
        completePolygon()
      } else {
        currentPath.value.push(point)
      }
    }
  } else {
    // Handle clicking annotations
    const found = findAnnotationUnderPoint(point)
    if (found !== null) {
      clickedAnnotation.value = found
      updateAnnotationToolsPosition(point)
    } else {
      clickedAnnotation.value = null
    }
  }
}

const handleDoubleClick = () => {
  if (currentTool.value === 'polygon' && isAnnotating.value && currentPath.value.length > 2) {
    completePolygon()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  const point = getCanvasPoint(event)
  mousePosition.value = point

  if (isDragging.value && selectedAnnotation.value !== null) {
    const dx = point.x - dragStartPosition.value!.x
    const dy = point.y - dragStartPosition.value!.y
    
    const annotation = canvasAnnotations.value[selectedAnnotation.value]
    if (annotation.type === 'rectangle' && annotation.startPoint) {
      annotation.startPoint.x = annotation.startPoint.x + dx
      annotation.startPoint.y = annotation.startPoint.y + dy
    } else if (annotation.type === 'polygon' && annotation.points) {
      annotation.points = annotation.points.map(p => ({
        x: p.x + dx,
        y: p.y + dy
      }))
    }
    
    dragStartPosition.value = point
    redrawCanvas()
  } else if (isAnnotating.value) {
    redrawCanvas()
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (currentTool.value === 'select') {
    const point = getCanvasPoint(event)
    const found = findAnnotationUnderPoint(point)
    if (found !== null) {
      isDragging.value = true
      selectedAnnotation.value = found
      dragStartPosition.value = point
      clickedAnnotation.value = null
    }
  }
}

const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    selectedAnnotation.value = null
    dragStartPosition.value = null
  }
}

const findAnnotationUnderPoint = (point: { x: number; y: number }): number | null => {
  for (let i = canvasAnnotations.value.length - 1; i >= 0; i--) {
    const annotation = canvasAnnotations.value[i]
    if (isPointInAnnotation(point, annotation)) {
      return i
    }
  }
  return null
}

const isPointInAnnotation = (point: { x: number; y: number }, annotation: CanvasAnnotation): boolean => {
  if (annotation.type === 'rectangle' && annotation.startPoint && annotation.width && annotation.height) {
    const minX = Math.min(annotation.startPoint.x, annotation.startPoint.x + annotation.width)
    const maxX = Math.max(annotation.startPoint.x, annotation.startPoint.x + annotation.width)
    const minY = Math.min(annotation.startPoint.y, annotation.startPoint.y + annotation.height)
    const maxY = Math.max(annotation.startPoint.y, annotation.startPoint.y + annotation.height)
    
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  } else if (annotation.type === 'polygon' && annotation.points) {
    return isPointInPolygon(point, annotation.points)
  }
  return false
}

const isPointInPolygon = (point: { x: number; y: number }, points: { x: number; y: number }[]): boolean => {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x, yi = points[i].y
    const xj = points[j].x, yj = points[j].y
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

const updateAnnotationToolsPosition = (point: { x: number; y: number }) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  annotationToolsPosition.value = {
    x: point.x + rect.left - 60,
    y: point.y + rect.top - 40
  }
}

const completeRectangle = (endPoint: { x: number; y: number }) => {
  if (!startPoint.value) return
  
  canvasAnnotations.value.push({
    type: 'rectangle',
    startPoint: { ...startPoint.value },
    width: endPoint.x - startPoint.value.x,
    height: endPoint.y - startPoint.value.y
  })
  
  isAnnotating.value = false
  startPoint.value = null
  redrawCanvas()
}

const completePolygon = () => {
  if (currentPath.value.length < 3) return
  
  canvasAnnotations.value.push({
    type: 'polygon',
    points: [...currentPath.value]
  })
  
  isAnnotating.value = false
  currentPath.value = []
  redrawCanvas()
}

const completeAnnotation = () => {
  if (!isAnnotating.value) return
  
  if (currentTool.value === 'rectangle' && startPoint.value) {
    completeRectangle(mousePosition.value)
  } else if (currentTool.value === 'polygon' && currentPath.value.length > 2) {
    completePolygon()
  }
}

const cancelAnnotation = () => {
  isAnnotating.value = false
  startPoint.value = null
  currentPath.value = []
  clickedAnnotation.value = null
  redrawCanvas()
}

const deleteAnnotation = (index: number) => {
  canvasAnnotations.value.splice(index, 1)
  clickedAnnotation.value = null
  redrawCanvas()
}

const startEditing = (index: number) => {
  selectedAnnotation.value = index
  const annotation = canvasAnnotations.value[index]
  
  if (annotation.type === 'rectangle' && annotation.startPoint) {
    isAnnotating.value = true
    currentTool.value = 'rectangle'
    startPoint.value = { ...annotation.startPoint }
  } else if (annotation.type === 'polygon' && annotation.points) {
    isAnnotating.value = true
    currentTool.value = 'polygon'
    currentPath.value = [...annotation.points]
  }
  
  canvasAnnotations.value.splice(index, 1)
  clickedAnnotation.value = null
}

const toggleDragMode = (index: number) => {
  isDragging.value = true
  selectedAnnotation.value = index
  dragStartPosition.value = mousePosition.value
  clickedAnnotation.value = null
}

const redrawCanvas = () => {
  if (!canvas.value || !ctx.value || !taskData.value?.dataUrl) return
  
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Draw background image
  const img = new Image()
  img.onload = () => {
    ctx.value!.drawImage(img, 0, 0)
    drawExistingAnnotations()
    drawCurrentAnnotation()
  }
  img.src = taskData.value.dataUrl
}

const drawExistingAnnotations = () => {
  if (!ctx.value) return
  
  ctx.value.strokeStyle = '#00ff00'
  ctx.value.lineWidth = 2

  canvasAnnotations.value.forEach((annotation, index) => {
    const isSelected = index === selectedAnnotation.value
    
    ctx.value!.beginPath()
    if (annotation.type === 'rectangle' && annotation.startPoint && annotation.width && annotation.height) {
      ctx.value!.strokeRect(
        annotation.startPoint.x,
        annotation.startPoint.y,
        annotation.width,
        annotation.height
      )
    } else if (annotation.type === 'polygon' && annotation.points) {
      ctx.value!.moveTo(annotation.points[0].x, annotation.points[0].y)
      annotation.points.forEach(point => {
        ctx.value!.lineTo(point.x, point.y)
      })
      ctx.value!.closePath()
    }
    
    ctx.value!.strokeStyle = isSelected ? '#ff0000' : '#00ff00'
    ctx.value!.lineWidth = isSelected ? 3 : 2
    ctx.value!.stroke()
  })
}

const drawCurrentAnnotation = () => {
  if (!ctx.value || !isAnnotating.value) return
  
  ctx.value.beginPath()
  ctx.value.strokeStyle = '#ff0000'
  ctx.value.lineWidth = 2

  if (currentTool.value === 'rectangle' && startPoint.value) {
    const width = mousePosition.value.x - startPoint.value.x
    const height = mousePosition.value.y - startPoint.value.y
    ctx.value.strokeRect(
      startPoint.value.x,
      startPoint.value.y,
      width,
      height
    )
  } else if (currentTool.value === 'polygon' && currentPath.value.length > 0) {
    ctx.value.moveTo(currentPath.value[0].x, currentPath.value[0].y)
    currentPath.value.forEach(point => {
      ctx.value!.lineTo(point.x, point.y)
    })
    ctx.value.lineTo(mousePosition.value.x, mousePosition.value.y)
    ctx.value.stroke()

    // Draw points
    currentPath.value.forEach((point, index) => {
      ctx.value!.beginPath()
      ctx.value!.fillStyle = index === 0 ? '#00ff00' : '#ffffff'
      ctx.value!.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.value!.fill()
      ctx.value!.stroke()
    })
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'unassigned':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'annotating':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }
}

const getReviewStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }
}

// Set page meta
definePageMeta({
  layout: false
})

// Watchers
watch(taskData, (newTaskData) => {
  if (newTaskData && isImageTask.value) {
    nextTick(() => {
      initializeCanvas()
    })
  }
}, { immediate: true })

// Keyboard event handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    cancelAnnotation()
  }
}

// Lifecycle
onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
