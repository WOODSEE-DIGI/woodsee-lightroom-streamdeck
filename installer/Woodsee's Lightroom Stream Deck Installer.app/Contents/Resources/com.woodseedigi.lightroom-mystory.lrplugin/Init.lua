--[[
  MyStory Lightroom Tagger — Companion Plugin

  TCP server that accepts commands from the Stream Deck plugin
  and executes Lightroom Classic SDK calls.

  Protocol: line-delimited JSON on localhost.
  Receive port (commands):  9876
  Send port (state push):   9877
--]]

local LrSocket          = import "LrSocket"
local LrTasks           = import "LrTasks"
local LrFunctionContext = import "LrFunctionContext"
local LrLogger          = import "LrLogger"
local LrSelection       = import "LrSelection"
local LrApplicationView = import "LrApplicationView"

local logger = LrLogger("MyStoryTagger")
logger:enable("print")

local CMD_PORT  = 9876
local STATE_PORT = 9877
local sendSocket = nil

----------------------------------------------------------------------
-- State helpers
----------------------------------------------------------------------
local function pushState()
    if not sendSocket then return end
    local rating = LrSelection.getRating() or 0
    local flag   = LrSelection.getFlag() or 0
    local label  = LrSelection.getColorLabel() or "none"
    local module = LrApplicationView.getCurrentModuleName() or "unknown"
    local line = string.format(
        "state|rating=%d|flag=%d|label=%s|module=%s\n",
        rating, flag, label, module
    )
    local ok, err = pcall(function() sendSocket:send(line) end)
    if not ok then
        logger:warn("state push failed: " .. tostring(err))
    end
end

----------------------------------------------------------------------
-- Command dispatcher
----------------------------------------------------------------------
local function handleCommand(message)
    -- message is a JSON string: {"cmd":"...", "value":"..."}
    local cmd, value

    -- Try JSON parse (simple pattern, no external lib needed)
    cmd  = string.match(message, '"cmd"%s*:%s*"([^"]*)"')
    value = string.match(message, '"value"%s*:%s*"?([^",}]-)"?')

    if not cmd then
        logger:warn("could not parse command: " .. tostring(message))
        return
    end

    cmd = string.lower(cmd)
    logger:info("cmd=" .. cmd .. " value=" .. tostring(value))

    -- Color labels
    if cmd == "label" then
        local valid = { red=true, yellow=true, green=true, blue=true, purple=true, none=true }
        if value and valid[value] then
            LrSelection.setColorLabel(value)
        end

    -- Star rating
    elseif cmd == "rate" then
        local n = tonumber(value)
        if n and n >= 0 and n <= 5 then
            LrSelection.setRating(math.floor(n))
        end

    -- Flag
    elseif cmd == "pick" then
        LrSelection.flagAsPick()
    elseif cmd == "reject" then
        LrSelection.flagAsReject()
    elseif cmd == "unflag" then
        LrSelection.removeFlag()

    -- Navigation
    elseif cmd == "next" then
        LrSelection.nextPhoto()
    elseif cmd == "prev" then
        LrSelection.previousPhoto()
    elseif cmd == "first" then
        LrSelection.selectFirstPhoto()
    elseif cmd == "last" then
        LrSelection.selectLastPhoto()

    -- View
    elseif cmd == "loupe" then
        LrApplicationView.showView("loupe")
    elseif cmd == "grid" then
        LrApplicationView.gridView()
    elseif cmd == "compare" then
        LrApplicationView.showView("compare")
    elseif cmd == "survey" then
        LrApplicationView.showView("survey")
    elseif cmd == "togglezoom" then
        LrApplicationView.toggleZoom()
    elseif cmd == "zoomin" then
        LrApplicationView.zoomIn()
    elseif cmd == "zoomout" then
        LrApplicationView.zoomOut()

    -- Module
    elseif cmd == "module" then
        if value then
            LrApplicationView.switchToModule(value)
        end

    -- Explicit state request
    elseif cmd == "getstate" then
        -- fall through to pushState below
    end

    pushState()
end

----------------------------------------------------------------------
-- TCP server
----------------------------------------------------------------------
LrTasks.startAsyncTask(function()
    LrFunctionContext.callWithContext("mystory_tagger_server", function(context)
        -- State push socket (Lightroom -> Stream Deck)
        local stateListener = LrSocket.bind {
            functionContext = context,
            plugin          = _PLUGIN,
            port            = STATE_PORT,
            mode            = "send",
            onConnected = function(socket, port)
                logger:info("state client connected on port " .. port)
                sendSocket = socket
                pushState()
            end,
            onClosed = function(socket)
                logger:info("state client disconnected")
                sendSocket = nil
            end,
            onError = function(socket, err)
                logger:warn("state socket error: " .. tostring(err))
            end,
        }

        -- Command receive socket (Stream Deck -> Lightroom)
        local cmdListener = LrSocket.bind {
            functionContext = context,
            plugin          = _PLUGIN,
            port            = CMD_PORT,
            mode            = "receive",
            onConnected = function(socket, port)
                logger:info("command client connected on port " .. port)
            end,
            onMessage = function(socket, message)
                handleCommand(message)
            end,
            onClosed = function(socket)
                logger:info("command client disconnected")
            end,
            onError = function(socket, err)
                logger:warn("command socket error: " .. tostring(err))
            end,
        }

        logger:info("MyStory Tagger listening on ports " .. CMD_PORT .. " (cmd) / " .. STATE_PORT .. " (state)")

        -- Keep alive
        while true do
            LrTasks.sleep(1)
        end
    end)
end)
