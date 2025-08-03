import { useEffect, useCallback } from 'react'

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    const { key, metaKey, ctrlKey, shiftKey, altKey } = event
    
    // Check each shortcut
    shortcuts.forEach(({ keys, action, description, preventDefault = true }) => {
      const keyMatch = keys.some(keyCombo => {
        const parts = keyCombo.split('+')
        let modifier, targetKey
        
        if (parts.length === 1) {
          // Single key like 'escape'
          modifier = 'none'
          targetKey = parts[0]
        } else {
          // Key with modifier like 'cmd+enter'
          modifier = parts.slice(0, -1).join('+')
          targetKey = parts[parts.length - 1]
        }
        
        // Check if the pressed key matches
        if (targetKey !== key) return false
        
        // Check modifiers
        switch (modifier) {
          case 'cmd':
          case 'ctrl':
            return (metaKey || ctrlKey) && !shiftKey && !altKey
          case 'cmd+shift':
          case 'ctrl+shift':
            return (metaKey || ctrlKey) && shiftKey && !altKey
          case 'cmd+alt':
          case 'ctrl+alt':
            return (metaKey || ctrlKey) && altKey && !shiftKey
          case 'shift':
            return shiftKey && !metaKey && !ctrlKey && !altKey
          case 'alt':
            return altKey && !metaKey && !ctrlKey && !shiftKey
          case 'none':
            return !metaKey && !ctrlKey && !shiftKey && !altKey
          default:
            return false
        }
      })
      
      if (keyMatch) {
        if (preventDefault) {
          event.preventDefault()
        }
        action(event)
      }
    })
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Predefined shortcuts for common actions
export const SHORTCUTS = {
  FOCUS_FILE_UPLOAD: {
    keys: ['cmd+f', 'ctrl+f'],
    description: 'Focus file upload area',
    action: () => {
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) {
        fileInput.click()
      }
    }
  },
  
  TOGGLE_TEXT_FILE: {
    keys: ['cmd+shift+u', 'ctrl+shift+u'],
    description: 'Toggle between text input and file upload',
    action: () => {
      // This will be implemented in the component
    }
  },
  
  QUICK_ACTIONS: {
    keys: ['cmd+k', 'ctrl+k'],
    description: 'Open quick actions menu',
    action: () => {
      // This will be implemented as a modal
    }
  },
  
  CLEAR_ALL: {
    keys: ['cmd+shift+c', 'ctrl+shift+c'],
    description: 'Clear all content',
    action: () => {
      // This will be implemented in the component
    }
  },
  
  SAVE_CONTENT: {
    keys: ['cmd+s', 'ctrl+s'],
    description: 'Save current content',
    action: () => {
      // This will be implemented as auto-save
    }
  },
  
  EXPORT_RESULT: {
    keys: ['cmd+e', 'ctrl+e'],
    description: 'Export current result',
    action: () => {
      // This will be implemented as export functionality
    }
  }
}

// Helper function to get platform-specific key display
export const getKeyDisplay = (keyCombo) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const [modifier, key] = keyCombo.split('+')
  
  const modifierDisplay = isMac 
    ? modifier.replace('cmd', '⌘').replace('ctrl', '⌃').replace('alt', '⌥').replace('shift', '⇧')
    : modifier.replace('cmd', 'Ctrl').replace('ctrl', 'Ctrl').replace('alt', 'Alt').replace('shift', 'Shift')
  
  return modifierDisplay ? `${modifierDisplay}+${key.toUpperCase()}` : key.toUpperCase()
} 