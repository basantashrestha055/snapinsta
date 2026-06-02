const EmptyChat = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">No conversation selected</h2>

        <p className="text-sm text-muted-foreground">
          Select a user from the left to start chatting
        </p>
      </div>
    </div>
  )
}

export default EmptyChat
