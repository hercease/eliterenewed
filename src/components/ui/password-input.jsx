'use client'

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Stack,
  mergeRefs,
  useControllableState,
} from '@chakra-ui/react'
import * as React from 'react'
import dynamic from 'next/dynamic'
const LuEye = dynamic(() =>
  import('react-icons/lu').then(mod => mod.LuEye), {
  ssr: false,
  loading: () => null
})
const LuEyeOff = dynamic(() =>
  import('react-icons/lu').then(mod => mod.LuEyeOff), {
  ssr: false,
  loading: () => null
})

export const PasswordInput = React.forwardRef(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    })

    const inputRef = React.useRef(null)

    return (
      <InputGroup
        endElement={
          <VisibilityTrigger
            disabled={rest.disabled}
            color="black"
            onPointerDown={(e) => {
              if (rest.disabled) return
              if (e.button !== 0) return
              e.preventDefault()
              setVisible(!visible)
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        }
        {...rootProps}
      >
        <Input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type={visible ? 'text' : 'password'}
        />
      </InputGroup>
    )
  },
)

const VisibilityTrigger = React.forwardRef(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1}
        ref={ref}
        me='-2'
        aspectRatio='square'
        size='sm'
        variant='ghost'
        height='calc(100% - {spacing.2})'
        aria-label='Toggle password visibility'
        {...props}
      />
    )
  },
)

export const PasswordStrengthMeter = React.forwardRef(
  function PasswordStrengthMeter(props, ref) {
    const { max = 4, value, ...rest } = props

    const percent = (value / max) * 100
    const { label, colorPalette } = getColorPalette(percent)

    return (
      <Stack align='flex-end' gap='1' ref={ref} {...rest}>
        <HStack width='full' ref={ref} {...rest}>
          {Array.from({ length: max }).map((_, index) => (
            <Box
              key={index}
              height='1'
              flex='1'
              rounded='sm'
              data-selected={index < value ? '' : undefined}
              layerStyle='fill.subtle'
              colorPalette='gray'
              _selected={{
                colorPalette,
                layerStyle: 'fill.solid',
              }}
            />
          ))}
        </HStack>
        {label && <HStack textStyle='xs'>{label}</HStack>}
      </Stack>
    )
  },
)

function getColorPalette(percent) {
  switch (true) {
    case percent < 33:
      return { label: 'Low', colorPalette: 'red' }
    case percent < 66:
      return { label: 'Medium', colorPalette: 'orange' }
    default:
      return { label: 'High', colorPalette: 'green' }
  }
}
